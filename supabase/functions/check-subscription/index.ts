
// Import required modules
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

// Helper function to create a standardized error response
const createErrorResponse = (message: string, status: number = 401, details?: any) => {
  console.log(`[CHECK-SUBSCRIPTION] Error: ${message}`);
  return new Response(
    JSON.stringify({ 
      error: message,
      details,
      hasActiveSubscription: false,
      isAdmin: false,
      hasTempAccess: false,
      has_trial_access: false 
    }),
    { 
      status: status, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    }
  );
};

// Create a response with subscription data
const createSuccessResponse = (data: any) => {
  return new Response(
    JSON.stringify(data),
    { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    }
  );
};

// Initialize Supabase client
const initSupabaseClient = (authHeader: string | null) => {
  if (!authHeader) {
    throw new Error("No authorization header provided");
  }

  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  );
};

// Get user from auth token
const getUser = async (supabaseClient: any) => {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError) {
    console.error("[CHECK-SUBSCRIPTION] User auth error:", userError);
    throw new Error("Failed to get user");
  }

  if (!user) {
    throw new Error("No user found");
  }

  console.log(`[CHECK-SUBSCRIPTION] User authenticated - ${JSON.stringify({userId: user.id, email: user.email})}`);
  return user;
};

// Check if user is admin
const checkAdminStatus = async (supabaseClient: any, userId: string) => {
  const { data: adminData, error: adminError } = await supabaseClient
    .from('user_roles')
    .select('*')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .single();

  const isAdmin = !adminError && adminData;
  console.log(`[CHECK-SUBSCRIPTION] Admin check - ${JSON.stringify({isAdmin: !!isAdmin})}`);
  
  return isAdmin;
};

// Check for active subscription
const checkSubscription = async (supabaseClient: any, userId: string) => {
  const { data: subscription, error: subscriptionError } = await supabaseClient
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();
  
  if (subscriptionError) {
    console.error("[CHECK-SUBSCRIPTION] Subscription check error:", subscriptionError);
  }
  
  console.log(`[CHECK-SUBSCRIPTION] Subscription check result - ${JSON.stringify({hasSubscription: !!subscription})}`);
  
  return { subscription, error: subscriptionError };
};

// Check for trial access
const checkTrialAccess = async (supabaseClient: any, userId: string) => {
  const now = new Date();
  const { data: subscriptionWithTrial, error: trialError } = await supabaseClient
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'trialing')
    .gt('trial_end', now.toISOString())
    .maybeSingle();
  
  if (trialError) {
    console.error("[CHECK-SUBSCRIPTION] Trial check error:", trialError);
  }

  const hasTrialAccess = !trialError && subscriptionWithTrial;
  console.log(`[CHECK-SUBSCRIPTION] Trial access check - ${JSON.stringify({
    hasTrialAccess: !!hasTrialAccess,
    trialData: subscriptionWithTrial
  })}`);
  
  return { subscriptionWithTrial, error: trialError };
};

// Check for temporary access
const checkTempAccess = async (supabaseClient: any, userId: string) => {
  const now = new Date();
  const { data: tempAccess, error: tempAccessError } = await supabaseClient
    .from('temp_access')
    .select('*')
    .eq('user_id', userId)
    .gt('expires_at', now.toISOString())
    .maybeSingle();
  
  if (tempAccessError) {
    console.error("[CHECK-SUBSCRIPTION] Temp access check error:", tempAccessError);
  }

  const hasTempAccess = !tempAccessError && tempAccess;
  console.log(`[CHECK-SUBSCRIPTION] Temp access check - ${JSON.stringify({hasTempAccess: !!hasTempAccess})}`);
  
  return { tempAccess, error: tempAccessError };
};

// Create or update admin subscription
const updateAdminSubscription = async (supabaseClient: any, userId: string, isAdmin: boolean) => {
  if (!isAdmin) return;
  
  try {
    // Check if admin already has a subscription
    const { data: existingAdminSub } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!existingAdminSub) {
      const now = new Date();
      // Create admin subscription if not exists
      const { error: createError } = await supabaseClient
        .from('subscriptions')
        .insert({
          user_id: userId,
          status: 'active',
          plan_type: 'admin',
          current_period_end: new Date(now.getFullYear() + 10, now.getMonth(), now.getDate()).toISOString(),
        });
      
      if (createError) {
        console.error('[CHECK-SUBSCRIPTION] Error updating admin subscription:', createError);
      } else {
        console.log('[CHECK-SUBSCRIPTION] Created admin subscription');
      }
    }
  } catch (error) {
    console.error('[CHECK-SUBSCRIPTION] Error updating admin subscription:', error);
  }
};

// Fetch all auth users (for admin users)
const getAuthUsers = async (supabaseClient: any, isAdmin: boolean) => {
  if (!isAdmin) return null;
  
  const { data: authUsers, error: authUsersError } = await supabaseClient.auth.admin.listUsers();
  if (authUsersError) {
    console.error("[CHECK-SUBSCRIPTION] Error fetching auth users:", authUsersError);
    return null;
  }
  
  return authUsers;
};

// Main handler function
console.log("[CHECK-SUBSCRIPTION] Function started");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return createErrorResponse("No authorization header", 401);
    }

    console.log("[CHECK-SUBSCRIPTION] Authorization header found");

    // Initialize Supabase client and get user
    let supabaseClient, user;
    try {
      supabaseClient = initSupabaseClient(authHeader);
      user = await getUser(supabaseClient);
    } catch (error) {
      return createErrorResponse(
        error instanceof Error ? error.message : "Authentication error", 
        200, // Using 200 for auth errors per existing pattern
        error
      );
    }

    // Check user privileges and subscriptions
    const now = new Date();
    const isAdmin = await checkAdminStatus(supabaseClient, user.id);
    const { subscription } = await checkSubscription(supabaseClient, user.id);
    const { subscriptionWithTrial } = await checkTrialAccess(supabaseClient, user.id);
    const { tempAccess } = await checkTempAccess(supabaseClient, user.id);
    
    const hasTrialAccess = 
      !!subscriptionWithTrial || 
      (subscriptionWithTrial?.status === 'trialing' && new Date(subscriptionWithTrial?.trial_end) > now);

    // Update admin subscription if needed
    await updateAdminSubscription(supabaseClient, user.id, !!isAdmin);

    // Fetch auth users for admin
    const allAuthUsers = await getAuthUsers(supabaseClient, !!isAdmin);

    // Prepare response data
    const responseData = {
      hasActiveSubscription: !!subscription && subscription?.status === 'active',
      hasTempAccess: !!tempAccess,
      has_trial_access: hasTrialAccess,
      isAdmin: !!isAdmin,
      subscribed: (!!subscription && subscription?.status === 'active') || !!hasTrialAccess,
      subscription,
      tempAccess,
      trial_access: subscriptionWithTrial,
      trial_end: subscriptionWithTrial?.trial_end || null,
      user: user,
      authUsers: allAuthUsers,
      subscription_tier: subscription?.plan_type || (hasTrialAccess ? 'trial' : (subscriptionWithTrial?.plan_type || null)),
      subscription_end: subscription?.current_period_end || tempAccess?.expires_at || null
    };

    // Return success response
    return createSuccessResponse(responseData);
    
  } catch (error) {
    console.error('[CHECK-SUBSCRIPTION] Error:', error);
    // Even on error, return 200 with default values to prevent blocking the user
    return createSuccessResponse({ 
      error: 'Internal Server Error', 
      message: String(error),
      hasActiveSubscription: false,
      isAdmin: false,
      hasTempAccess: false,
      has_trial_access: false
    });
  }
});

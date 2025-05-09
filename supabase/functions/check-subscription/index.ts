
// Import required modules
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createErrorResponse, createSuccessResponse } from "../_shared/response.ts";
import { initSupabaseClient, getUser } from "../_shared/auth.ts";
import { 
  checkAdminStatus, 
  checkSubscription, 
  checkTrialAccess, 
  checkTempAccess 
} from "./subscription-queries.ts";
import { 
  updateAdminSubscription, 
  getAuthUsers 
} from "./admin-operations.ts";

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

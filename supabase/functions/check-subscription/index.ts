
// Import required modules
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

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
      console.log("[CHECK-SUBSCRIPTION] No authorization header provided");
      return new Response(
        JSON.stringify({ 
          error: 'No authorization header',
          hasActiveSubscription: false,
          isAdmin: false,
          hasTempAccess: false,
          has_trial_access: false 
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[CHECK-SUBSCRIPTION] Authorization header found");

    // Create supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get user from token
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError) {
      console.error("[CHECK-SUBSCRIPTION] User auth error:", userError);
      
      // Return a user-friendly response even when auth fails
      return new Response(
        JSON.stringify({ 
          error: 'Failed to get user', 
          details: userError,
          hasActiveSubscription: false,
          isAdmin: false,
          hasTempAccess: false,
          has_trial_access: false 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!user) {
      console.log("[CHECK-SUBSCRIPTION] No user found from auth token");
      return new Response(
        JSON.stringify({ 
          error: 'No user found',
          hasActiveSubscription: false,
          isAdmin: false,
          hasTempAccess: false,
          has_trial_access: false 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[CHECK-SUBSCRIPTION] User authenticated - ${JSON.stringify({userId: user.id, email: user.email})}`);

    // Check if user is admin
    const { data: adminData, error: adminError } = await supabaseClient
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    const isAdmin = !adminError && adminData;
    console.log(`[CHECK-SUBSCRIPTION] Admin check - ${JSON.stringify({isAdmin: !!isAdmin})}`);

    // Check for active subscription
    const { data: subscription, error: subscriptionError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
    
    if (subscriptionError) {
      console.error("[CHECK-SUBSCRIPTION] Subscription check error:", subscriptionError);
    }
    
    console.log(`[CHECK-SUBSCRIPTION] Subscription check result - ${JSON.stringify({hasSubscription: !!subscription})}`);

    // Check for trial access
    const now = new Date();
    const { data: subscriptionWithTrial, error: trialError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'trialing')
      .gt('trial_end', now.toISOString())
      .maybeSingle();
    
    if (trialError) {
      console.error("[CHECK-SUBSCRIPTION] Trial check error:", trialError);
    }

    const hasTrialAccess = !trialError && subscriptionWithTrial;
    console.log(`[CHECK-SUBSCRIPTION] Trial access check - ${JSON.stringify({hasTrialAccess: !!hasTrialAccess})}`);

    // Check for temporary access
    const { data: tempAccess, error: tempAccessError } = await supabaseClient
      .from('temp_access')
      .select('*')
      .eq('user_id', user.id)
      .gt('expires_at', now.toISOString())
      .maybeSingle();
    
    if (tempAccessError) {
      console.error("[CHECK-SUBSCRIPTION] Temp access check error:", tempAccessError);
    }

    const hasTempAccess = !tempAccessError && tempAccess;
    console.log(`[CHECK-SUBSCRIPTION] Temp access check - ${JSON.stringify({hasTempAccess: !!hasTempAccess})}`);

    // If user is admin, try to update admin subscription if not exists
    if (isAdmin) {
      try {
        // Check if admin already has a subscription
        const { data: existingAdminSub } = await supabaseClient
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!existingAdminSub) {
          // Create admin subscription if not exists
          const { error: createError } = await supabaseClient
            .from('subscriptions')
            .insert({
              user_id: user.id,
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
    }

    // Fetch all auth users for admin
    let allAuthUsers = null;
    if (isAdmin) {
      const { data: authUsers, error: authUsersError } = await supabaseClient.auth.admin.listUsers();
      if (!authUsersError) {
        allAuthUsers = authUsers;
      }
    }

    // Always return 200 status code with subscription state
    return new Response(
      JSON.stringify({
        hasActiveSubscription: !subscriptionError && subscription?.status === 'active',
        hasTempAccess: !!hasTempAccess,
        has_trial_access: !!hasTrialAccess,
        isAdmin: !!isAdmin,
        subscribed: (!subscriptionError && subscription?.status === 'active') || !!hasTrialAccess,
        subscription,
        tempAccess,
        trial_access: subscriptionWithTrial,
        trial_end: subscriptionWithTrial?.trial_end || null,
        user: user,
        authUsers: allAuthUsers,
        subscription_tier: subscription?.plan_type || (hasTrialAccess ? 'trial' : null),
        subscription_end: subscription?.current_period_end || null
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error('[CHECK-SUBSCRIPTION] Error:', error);
    // Even on error, return 200 with default values to prevent blocking the user
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error', 
        message: String(error),
        hasActiveSubscription: false,
        isAdmin: false,
        hasTempAccess: false,
        has_trial_access: false
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

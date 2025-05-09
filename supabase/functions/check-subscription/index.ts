
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
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
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

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Failed to get user', details: userError }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    // Check for temporary access
    const now = new Date();
    const { data: tempAccess, error: tempAccessError } = await supabaseClient
      .from('temp_access')
      .select('*')
      .eq('user_id', user.id)
      .gt('expires_at', now.toISOString())
      .maybeSingle();

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
            console.error('Error updating admin subscription:', createError);
          }
        }
      } catch (error) {
        console.error('Error updating admin subscription:', error);
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

    // Prepare response
    return new Response(
      JSON.stringify({
        hasActiveSubscription: !subscriptionError && subscription?.status === 'active',
        hasTempAccess: !!hasTempAccess,
        isAdmin: !!isAdmin,
        subscription,
        tempAccess,
        user: user,
        authUsers: allAuthUsers
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

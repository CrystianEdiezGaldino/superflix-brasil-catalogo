
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

console.log("[GRANT-TRIAL-ACCESS] Function started");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create supabase admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get request body
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[GRANT-TRIAL-ACCESS] Granting trial access for user ${userId}`);

    // Get current date for start and calculate end date (7 days in the future)
    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(now.getDate() + 7); // 7 days trial period

    // Create a trial subscription for the user
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: userId,
        status: 'trialing',
        plan_type: 'trial',
        current_period_start: now.toISOString(),
        trial_end: trialEnd.toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("[GRANT-TRIAL-ACCESS] Error granting trial access:", error);
      return new Response(
        JSON.stringify({ error: 'Failed to grant trial access', details: error }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[GRANT-TRIAL-ACCESS] Trial access granted for user ${userId} until ${trialEnd.toISOString()}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Trial access granted successfully', 
        trial_end: trialEnd.toISOString(),
        data
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error('[GRANT-TRIAL-ACCESS] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

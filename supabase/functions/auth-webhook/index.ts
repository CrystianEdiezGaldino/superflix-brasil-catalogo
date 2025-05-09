
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

console.log("[AUTH-WEBHOOK] Function started");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const payload = await req.json();
    const { type, email, user_id } = payload;

    console.log(`[AUTH-WEBHOOK] Received event: ${type} for user ${user_id}`);

    if (type === "signup" || type === "email_confirmed") {
      // When a user signs up or confirms their email, grant them a 7-day trial
      console.log(`[AUTH-WEBHOOK] Processing signup/confirmation for user ${user_id}`);

      try {
        // Check if the user already has an active subscription
        const { data: existingSubscription } = await supabaseAdmin
          .from("subscriptions")
          .select("*")
          .eq("user_id", user_id)
          .or("status.eq.active,status.eq.trialing");

        if (!existingSubscription || existingSubscription.length === 0) {
          // User doesn't have an active subscription, create a trial
          console.log(`[AUTH-WEBHOOK] Creating trial subscription for user ${user_id}`);
          
          // Calculate trial end date (7 days from now)
          const now = new Date();
          const trialEnd = new Date(now);
          trialEnd.setDate(trialEnd.getDate() + 7);
          
          const { data: subscription, error } = await supabaseAdmin
            .from("subscriptions")
            .insert({
              user_id,
              status: "trialing",
              plan_type: "trial",
              current_period_start: now.toISOString(),
              trial_end: trialEnd.toISOString()
            })
            .select()
            .single();
            
          if (error) {
            throw error;
          }
          
          console.log(`[AUTH-WEBHOOK] Trial subscription created for ${user_id} until ${trialEnd.toISOString()}`);
          
          return new Response(
            JSON.stringify({ success: true, action: "trial_created", subscription }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
          );
        } else {
          console.log(`[AUTH-WEBHOOK] User ${user_id} already has an active subscription`);
          return new Response(
            JSON.stringify({ success: true, action: "no_action_needed" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
          );
        }
      } catch (error) {
        console.error(`[AUTH-WEBHOOK] Error processing user ${user_id}:`, error);
        throw error;
      }
    }

    return new Response(
      JSON.stringify({ success: true, action: "no_action_needed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("[AUTH-WEBHOOK] Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

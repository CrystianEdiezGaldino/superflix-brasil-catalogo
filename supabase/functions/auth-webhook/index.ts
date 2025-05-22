import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AUTH-WEBHOOK] ${step}${detailsStr}`);
};

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

    logStep("Received event", { type, email, user_id });

    if (type === "signup" || type === "email_confirmed") {
      // When a user signs up or confirms their email, grant them a 7-day trial
      logStep("Processing signup/confirmation");

      try {
        // First, ensure a profile exists for this user
        const { data: existingProfile, error: profileError } = await supabaseAdmin
          .from("profiles")
          .select("*")
          .eq("id", user_id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found" error
          logStep("Error checking profile", { error: profileError });
          throw profileError;
        }

        if (!existingProfile) {
          logStep("Creating profile");
          
          // Create a profile for the user
          const { error: createProfileError } = await supabaseAdmin
            .from("profiles")
            .insert({
              id: user_id,
              username: email || `user_${user_id.substring(0, 8)}`,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          if (createProfileError) {
            logStep("Error creating profile", { error: createProfileError });
            throw createProfileError;
          }
          
          logStep("Profile created successfully");
        }

        // Check if the user already has an active subscription
        const { data: existingSubscription, error: subscriptionError } = await supabaseAdmin
          .from("subscriptions")
          .select("*")
          .eq("user_id", user_id)
          .or("status.eq.active,status.eq.trialing");

        if (subscriptionError) {
          logStep("Error checking subscription", { error: subscriptionError });
          throw subscriptionError;
        }

        if (!existingSubscription || existingSubscription.length === 0) {
          // User doesn't have an active subscription, create a trial
          logStep("Creating trial subscription");
          
          // Calculate trial end date (7 days from now)
          const now = new Date();
          const trialEnd = new Date(now);
          trialEnd.setDate(trialEnd.getDate() + 7);
          
          // First, delete any existing trial subscriptions to avoid duplicates
          const { error: deleteError } = await supabaseAdmin
            .from("subscriptions")
            .delete()
            .eq("user_id", user_id)
            .eq("status", "trialing");
            
          if (deleteError) {
            logStep("Error deleting existing trial", { error: deleteError });
            // Continue anyway, as this is not critical
          }
          
          const { data: subscription, error: createSubscriptionError } = await supabaseAdmin
            .from("subscriptions")
            .insert({
              user_id,
              status: "trialing",
              plan_type: "trial",
              current_period_start: now.toISOString(),
              current_period_end: trialEnd.toISOString(),
              trial_end: trialEnd.toISOString(),
              created_at: now.toISOString(),
              updated_at: now.toISOString()
            })
            .select()
            .single();
            
          if (createSubscriptionError) {
            logStep("Error creating subscription", { error: createSubscriptionError });
            throw createSubscriptionError;
          }
          
          logStep("Trial subscription created", { 
            subscription,
            trialEnd: trialEnd.toISOString()
          });
          
          // Verify the subscription was created
          const { data: verifySubscription, error: verifyError } = await supabaseAdmin
            .from("subscriptions")
            .select("*")
            .eq("user_id", user_id)
            .eq("status", "trialing")
            .single();
            
          if (verifyError || !verifySubscription) {
            logStep("Error verifying subscription creation", { error: verifyError });
            throw new Error("Failed to verify subscription creation");
          }
          
          logStep("Subscription verified", { subscription: verifySubscription });
          
          return new Response(
            JSON.stringify({ 
              success: true, 
              action: "trial_created", 
              subscription: verifySubscription 
            }),
            { 
              headers: { ...corsHeaders, "Content-Type": "application/json" }, 
              status: 200 
            }
          );
        } else {
          logStep("User already has active subscription", { subscription: existingSubscription });
          return new Response(
            JSON.stringify({ 
              success: true, 
              action: "no_action_needed",
              subscription: existingSubscription[0]
            }),
            { 
              headers: { ...corsHeaders, "Content-Type": "application/json" }, 
              status: 200 
            }
          );
        }
      } catch (error) {
        logStep("Error processing user", { error });
        throw error;
      }
    }

    // For other event types, just return success
    return new Response(
      JSON.stringify({ 
        success: true, 
        action: "no_action_needed" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 200 
      }
    );
  } catch (error) {
    logStep("Error in webhook", { error });
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 500 
      }
    );
  }
});

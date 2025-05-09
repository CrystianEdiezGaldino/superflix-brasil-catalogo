
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[EXTEND-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    // Get Stripe key
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.id) throw new Error("User not authenticated");
    
    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Session ID is required");

    logStep("Processing request", { userId: user.id, sessionId });

    // Get extension data
    const { data: extensionData, error: extensionError } = await supabaseClient
      .from('subscription_extensions')
      .select('*')
      .eq('user_id', user.id)
      .eq('checkout_session_id', sessionId)
      .eq('processed', false)
      .single();
    
    if (extensionError || !extensionData) {
      logStep("No extension data found", { extensionError });
      return new Response(JSON.stringify({ 
        success: false, 
        message: "No subscription extension found" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== 'paid' || !session.subscription) {
      logStep("Invalid session or payment not completed", { 
        sessionId, 
        paymentStatus: session?.payment_status,
        hasSubscription: !!session?.subscription
      });
      
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Checkout session not completed or invalid" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const subscriptionId = session.subscription as string;
    
    // Retrieve the subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Calculate new billing period end date (add trial days)
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    const newPeriodEnd = new Date(currentPeriodEnd);
    newPeriodEnd.setDate(newPeriodEnd.getDate() + extensionData.days_to_add);
    
    logStep("Extending subscription", { 
      subscriptionId, 
      currentEnd: currentPeriodEnd.toISOString(),
      newEnd: newPeriodEnd.toISOString(),
      daysAdded: extensionData.days_to_add
    });

    // Update the subscription billing cycle
    await stripe.subscriptions.update(subscriptionId, {
      proration_behavior: 'none',
      billing_cycle_anchor: Math.floor(newPeriodEnd.getTime() / 1000),
      trial_end: Math.floor(newPeriodEnd.getTime() / 1000),
    });

    // Mark the extension as processed
    await supabaseClient
      .from('subscription_extensions')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('id', extensionData.id);

    // Update the subscription in our database
    await supabaseClient
      .from('subscriptions')
      .update({
        status: 'active',
        current_period_end: newPeriodEnd.toISOString(),
        stripe_subscription_id: subscriptionId,
        updated_at: new Date().toISOString(),
        plan_type: subscription.items.data[0]?.price?.lookup_key || 'default'
      })
      .eq('user_id', user.id);

    logStep("Subscription extended successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Subscription extended with trial days",
      daysAdded: extensionData.days_to_add,
      newEndDate: newPeriodEnd.toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[EXTEND-SUBSCRIPTION] Error: ${errorMessage}`);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

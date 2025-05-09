
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
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
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
      return new Response(JSON.stringify({ 
        error: "Sistema de pagamento não configurado. Contate o administrador.",
        demo_mode: true 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200, // Returning 200 with error message in demo mode
      });
    }
    
    const { priceId, mode } = await req.json();
    
    if (!priceId || !mode) {
      throw new Error("Price ID and mode are required");
    }

    logStep("Stripe key verified");

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check if a customer record exists for this user
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      // Create a new customer record
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
      logStep("Created new customer", { customerId });
    }

    // Check if user has remaining trial days to add to subscription
    const { data: trialData } = await supabaseClient
      .from('subscriptions')
      .select('trial_end, status')
      .eq('user_id', user.id)
      .eq('status', 'trialing')
      .maybeSingle();
    
    let trialDaysToAdd = 0;
    
    if (trialData?.trial_end && trialData.status === 'trialing') {
      const trialEndDate = new Date(trialData.trial_end);
      const now = new Date();
      
      // Calculate remaining trial days if trial is still active
      if (trialEndDate > now) {
        const diffTime = Math.abs(trialEndDate.getTime() - now.getTime());
        trialDaysToAdd = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        logStep("Found active trial with remaining days", { 
          trialEndDate: trialData.trial_end, 
          remainingDays: trialDaysToAdd 
        });
      }
    }

    // Create checkout session
    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    // Define subscription data for checkout session
    const subscriptionDataConfig = {
      // Ensure trial_period_days is at least 1 if specified
      trial_period_days: trialDaysToAdd > 0 ? trialDaysToAdd : 7,
      trial_settings: {
        end_behavior: {
          missing_payment_method: 'cancel'
        }
      }
    };

    // For demo mode with no valid price IDs
    if (priceId === "price_monthly" || priceId === "price_annual") {
      // Create a demo payment session with a test price
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'brl',
            product_data: {
              name: priceId === "price_monthly" ? "Plano Mensal" : "Plano Anual"
            },
            unit_amount: priceId === "price_monthly" ? 990 : 10000,
            recurring: mode === "subscription" ? {
              interval: priceId === "price_monthly" ? "month" : "year"
            } : undefined
          },
          quantity: 1
        }],
        mode: mode,
        success_url: `${origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/subscribe`,
        allow_promotion_codes: true,
        subscription_data: mode === "subscription" ? subscriptionDataConfig : undefined
      });

      logStep("Demo checkout session created", { sessionId: session.id, url: session.url });

      return new Response(JSON.stringify({ 
        url: session.url,
        sessionId: session.id,
        trialDaysToAdd: trialDaysToAdd
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      // Normal case with real price IDs
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: mode,
        success_url: `${origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/subscribe`,
        allow_promotion_codes: true,
        subscription_data: mode === "subscription" ? subscriptionDataConfig : undefined
      });

      logStep("Checkout session created", { sessionId: session.id, url: session.url });

      return new Response(JSON.stringify({ 
        url: session.url,
        sessionId: session.id,
        trialDaysToAdd: trialDaysToAdd
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[CREATE-CHECKOUT] Error: ${errorMessage}`);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

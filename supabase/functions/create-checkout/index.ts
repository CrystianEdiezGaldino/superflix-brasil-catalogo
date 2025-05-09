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

// Mapeamento dos product IDs para os preços
const PRODUCT_PRICE_MAP = {
  "prod_SHSb9G94AXb8Nl": "price_1Qkiz906o9nmaCFZL6CQMeEM", // mensal
  "prod_SHSce9XGUSazQq": "price_1Qkj0S06o9nmaCFZHli9wwLC"  // anual
};

// Mapeamento dos product IDs para acessos simultâneos
const PRODUCT_ACCESS_MAP = {
  "prod_SHSb9G94AXb8Nl": 3, // mensal: 3 acessos
  "prod_SHSce9XGUSazQq": 6  // anual: 6 acessos
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
      // Return error but allow demo mode
      throw new Error("Sistema de pagamento não configurado. Contate o administrador.");
    }
    
    const { priceId, mode } = await req.json();
    
    if (!priceId || !mode) {
      throw new Error("Price ID and mode are required");
    }

    logStep("Request parameters", { priceId, mode });
    
    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    logStep("Stripe initialized");

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
    
    let trialDaysToAdd = 7; // Default to 7 days
    
    if (trialData?.trial_end && trialData.status === 'trialing') {
      const trialEndDate = new Date(trialData.trial_end);
      const now = new Date();
      
      // Calculate remaining trial days if trial is still active
      if (trialEndDate > now) {
        const diffTime = Math.abs(trialEndDate.getTime() - now.getTime());
        trialDaysToAdd = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))); // Ensure at least 1 day
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
      trial_period_days: trialDaysToAdd,
      trial_settings: {
        end_behavior: {
          missing_payment_method: 'cancel'
        }
      }
    };

    // Determine metadata based on price ID
    const isAnnual = priceId.includes("anual") || priceId.includes("annual");
    const simultaneousAccesses = isAnnual ? 6 : 3;
    const productId = isAnnual ? "prod_SHSce9XGUSazQq" : "prod_SHSb9G94AXb8Nl";
    
    logStep("Creating checkout session", { 
      priceId, 
      customerId, 
      simultaneousAccesses, 
      productId
    });

    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product: productId,
              unit_amount: isAnnual ? 10000 : 990,
              recurring: mode === 'subscription' ? {
                interval: isAnnual ? 'year' : 'month',
              } : undefined
            },
            quantity: 1,
          }
        ],
        mode: mode,
        success_url: `${origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/subscribe`,
        allow_promotion_codes: true,
        subscription_data: mode === "subscription" ? subscriptionDataConfig : undefined,
        metadata: {
          user_id: user.id,
          simultaneous_accesses: simultaneousAccesses.toString(),
          product_id: productId
        }
      });

      if (!session || !session.url) {
        throw new Error("Falha ao criar sessão de checkout. URL não retornada.");
      }

      logStep("Checkout session created successfully", { 
        sessionId: session.id, 
        url: session.url,
        hasUrl: !!session.url
      });

      return new Response(JSON.stringify({ 
        url: session.url,
        sessionId: session.id,
        trialDaysToAdd: trialDaysToAdd
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (stripeError: any) {
      // More specific error logging
      logStep("Stripe error creating checkout session", { 
        message: stripeError.message,
        type: stripeError.type,
        code: stripeError.code
      });
      
      throw stripeError;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[CREATE-CHECKOUT] Error: ${errorMessage}`);
    
    // Keep 200 status but with error property so frontend can show appropriate message
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});

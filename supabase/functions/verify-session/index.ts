
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
  console.log(`[VERIFY-SESSION] ${step}${detailsStr}`);
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
      throw new Error("Sistema de pagamento não configurado");
    }
    
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    logStep("Verifying session", { sessionId });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Retrieve session to verify it's valid
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      throw new Error("Session not found");
    }
    
    // Check session status and payment status
    const isCompleted = session.status === "complete";
    const paymentStatus = session.payment_status;
    const isValid = isCompleted && (paymentStatus === "paid" || paymentStatus === "no_payment_required");
    
    logStep("Session verification result", { 
      isCompleted, 
      paymentStatus, 
      isValid,
      customerId: session.customer,
      mode: session.mode
    });

    return new Response(JSON.stringify({ 
      valid: isValid,
      status: session.status,
      paymentStatus: session.payment_status
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("Error", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      valid: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200, // Keep 200 to avoid non-2xx errors
    });
  }
});

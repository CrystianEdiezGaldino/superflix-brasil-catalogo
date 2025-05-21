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

// Update the CORS headers to accept any origin
const updatedCorsHeaders = {
  'Access-Control-Allow-Origin': '*',  // Allow any origin
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Cache for recent verifications
const verificationCache = new Map();
const CACHE_TTL = 60000; // 1 minute TTL for cache

// Main handler function
console.log("[CHECK-SUBSCRIPTION] Function started");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: updatedCorsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return createErrorResponse("No authorization header", 401, updatedCorsHeaders);
    }

    // Initialize Supabase client and get user
    let supabaseClient, user;
    try {
      supabaseClient = initSupabaseClient(authHeader);
      user = await getUser(supabaseClient);
    } catch (error) {
      console.error("[CHECK-SUBSCRIPTION] Auth error:", error);
      
      // Retornar valores não permissivos em caso de erro de autenticação
      return new Response(
        JSON.stringify({
          hasActiveSubscription: false,
          isAdmin: false,
          hasTempAccess: false,
          has_trial_access: false,
          subscription_tier: 'none',
          user: { id: 'unknown', email: 'unknown' }
        }),
        {
          status: 200,
          headers: { ...updatedCorsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Check cache for recent results
    const cacheKey = user.id;
    const cachedResult = verificationCache.get(cacheKey);
    const now = Date.now();
    
    if (cachedResult && (now - cachedResult.timestamp < CACHE_TTL)) {
      console.log("[CHECK-SUBSCRIPTION] Returning cached result for user:", user.id);
      return createSuccessResponse(cachedResult.data, updatedCorsHeaders);
    }

    // Check user status
    const currentTime = new Date();
    const isAdmin = await checkAdminStatus(supabaseClient, user.id);
    const { subscription } = await checkSubscription(supabaseClient, user.id);
    const { subscriptionWithTrial } = await checkTrialAccess(supabaseClient, user.id);
    const { tempAccess } = await checkTempAccess(supabaseClient, user.id);
    
    // Determine user access state
    const hasTrialAccess = 
      subscriptionWithTrial && 
      subscriptionWithTrial.status === 'trialing' && 
      new Date(subscriptionWithTrial.trial_end) > currentTime;
      
    const hasActiveSubscription = 
      subscription && 
      subscription.status === 'active';
      
    const hasTempAccess = 
      tempAccess && 
      new Date(tempAccess.expires_at) > currentTime;

    // Log results for debugging
    console.log(`[CHECK-SUBSCRIPTION] Access check results:`, {
      userId: user.id,
      email: user.email,
      hasActiveSubscription,
      hasTrialAccess,
      hasTempAccess,
      isAdmin: !!isAdmin
    });

    // Prepare response data
    const responseData = {
      hasActiveSubscription: hasActiveSubscription,
      hasTempAccess,
      has_trial_access: hasTrialAccess,
      isAdmin: !!isAdmin,
      user: { id: user.id, email: user.email },
      subscription_tier: subscription?.plan_type || (hasTrialAccess ? 'trial' : 'free'),
      subscription_end: subscription?.current_period_end || tempAccess?.expires_at || null,
      trial_end: subscriptionWithTrial?.trial_end || null
    };

    // Store result in cache
    verificationCache.set(cacheKey, {
      timestamp: now,
      data: responseData
    });

    // Return success response
    return createSuccessResponse(responseData, updatedCorsHeaders);
    
  } catch (error) {
    console.error('[CHECK-SUBSCRIPTION] Error:', error);
    
    // Retornar valores não permissivos em caso de erro
    return new Response(
      JSON.stringify({
        error: String(error),
        hasActiveSubscription: false,
        isAdmin: false,
        hasTempAccess: false,
        has_trial_access: false,
        subscription_tier: 'none'
      }),
      {
        status: 200,
        headers: { ...updatedCorsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

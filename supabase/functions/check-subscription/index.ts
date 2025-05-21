
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

// Objeto para armazenar em cache verificações recentes
const verificationCache = new Map();
const CACHE_TTL = 60000; // 1 minuto de TTL para cache

// Main handler function
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
      return createErrorResponse("No authorization header", 401);
    }

    // Initialize Supabase client and get user
    let supabaseClient, user;
    try {
      supabaseClient = initSupabaseClient(authHeader);
      user = await getUser(supabaseClient);
    } catch (error) {
      console.error("[CHECK-SUBSCRIPTION] Auth error:", error);
      return createErrorResponse(
        error instanceof Error ? error.message : "Authentication error", 
        401
      );
    }

    // Verificar cache para resultados recentes
    const cacheKey = user.id;
    const cachedResult = verificationCache.get(cacheKey);
    const now = Date.now();
    
    if (cachedResult && (now - cachedResult.timestamp < CACHE_TTL)) {
      console.log("[CHECK-SUBSCRIPTION] Returning cached result for user:", user.id);
      return createSuccessResponse(cachedResult.data);
    }

    // Verificar status do usuário
    const currentTime = new Date();
    const isAdmin = await checkAdminStatus(supabaseClient, user.id);
    const { subscription } = await checkSubscription(supabaseClient, user.id);
    const { subscriptionWithTrial } = await checkTrialAccess(supabaseClient, user.id);
    const { tempAccess } = await checkTempAccess(supabaseClient, user.id);
    
    // Determinar estado de acesso do usuário
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

    // Log dos resultados para debug
    console.log(`[CHECK-SUBSCRIPTION] Access check results:`, {
      userId: user.id,
      email: user.email,
      hasActiveSubscription,
      hasTrialAccess,
      hasTempAccess,
      isAdmin: !!isAdmin
    });

    // Preparar dados de resposta
    const responseData = {
      hasActiveSubscription,
      hasTempAccess,
      has_trial_access: hasTrialAccess,
      isAdmin: !!isAdmin,
      user: { id: user.id, email: user.email },
      subscription_tier: subscription?.plan_type || (hasTrialAccess ? 'trial' : null),
      subscription_end: subscription?.current_period_end || tempAccess?.expires_at || null,
      trial_end: subscriptionWithTrial?.trial_end || null
    };

    // Armazenar resultado em cache
    verificationCache.set(cacheKey, {
      timestamp: now,
      data: responseData
    });

    // Retornar resposta de sucesso
    return createSuccessResponse(responseData);
    
  } catch (error) {
    console.error('[CHECK-SUBSCRIPTION] Error:', error);
    // Em caso de erro, retornar 200 com valores padrão para não bloquear o usuário
    return new Response(
      JSON.stringify({
        error: String(error),
        hasActiveSubscription: true, // Alterado para true para evitar bloqueios 
        isAdmin: false,
        hasTempAccess: false,
        has_trial_access: true // Alterado para true para evitar bloqueios
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

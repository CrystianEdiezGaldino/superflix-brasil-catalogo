
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Initialize Supabase client
export const initSupabaseClient = (authHeader: string | null) => {
  if (!authHeader) {
    console.error("[CHECK-SUBSCRIPTION] No authorization header provided");
    throw new Error("No authorization header provided");
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("[CHECK-SUBSCRIPTION] Missing Supabase environment variables");
    throw new Error("Missing Supabase environment variables");
  }

  console.log("[CHECK-SUBSCRIPTION] Initializing Supabase client");
  
  return createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    { global: { headers: { Authorization: authHeader } } }
  );
};

// Get user from auth token
export const getUser = async (supabaseClient: any) => {
  try {
    console.log("[CHECK-SUBSCRIPTION] Getting user from auth token");
    
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError) {
      console.error("[CHECK-SUBSCRIPTION] User auth error:", userError);
      throw new Error("Failed to get user");
    }

    if (!user) {
      console.error("[CHECK-SUBSCRIPTION] No user found");
      throw new Error("No user found");
    }

    console.log(`[CHECK-SUBSCRIPTION] User authenticated - ${JSON.stringify({userId: user.id, email: user.email})}`);
    return user;
  } catch (error) {
    console.error("[CHECK-SUBSCRIPTION] Authentication error:", error);
    throw error;
  }
};


import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Initialize Supabase client
export const initSupabaseClient = (authHeader: string | null) => {
  if (!authHeader) {
    throw new Error("No authorization header provided");
  }

  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  );
};

// Get user from auth token
export const getUser = async (supabaseClient: any) => {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError) {
    console.error("[CHECK-SUBSCRIPTION] User auth error:", userError);
    throw new Error("Failed to get user");
  }

  if (!user) {
    throw new Error("No user found");
  }

  console.log(`[CHECK-SUBSCRIPTION] User authenticated - ${JSON.stringify({userId: user.id, email: user.email})}`);
  return user;
};

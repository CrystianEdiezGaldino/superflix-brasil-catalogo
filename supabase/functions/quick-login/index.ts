/// <reference path="./types.d.ts" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Custom alphabet for generating codes
const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// Function to generate a random alphanumeric code
const generateAlphanumericCode = (length: number): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * ALPHANUMERIC.length);
    result += ALPHANUMERIC[randomIndex];
  }
  return result;
};

// CORS headers to allow cross-origin requests from any origin
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

// Enhanced logging function
const log = (message: string, data?: any, isError = false) => {
  const logMethod = isError ? console.error : console.log;
  logMethod(`[QUICK-LOGIN] ${message}`, data ? JSON.stringify(data) : "");
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", // Use service role key for admin operations
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    );

    // Get the code from the request body
    const { code } = await req.json();

    if (!code) {
      throw new Error("Code is required");
    }

    // Check if the code exists and is valid
    const { data: loginCode, error: codeError } = await supabaseClient
      .from("login_codes")
      .select("id, code, user_id, status")
      .eq("code", code)
      .single();

    if (codeError || !loginCode?.user_id) {
      throw new Error("Invalid code");
    }

    // Get the user's email
    const { data: userData, error: userError } = await supabaseClient
      .from("profiles")
      .select("username")
      .eq("id", loginCode.user_id)
      .single();

    if (userError || !userData?.username) {
      throw new Error("User not found");
    }

    // Generate a temporary password
    const tempPassword = `temp_${code}_${Date.now()}`;

    // Update the user's password using admin privileges
    const { error: updateError } = await supabaseClient.auth.admin.updateUserById(
      loginCode.user_id,
      { password: tempPassword }
    );

    if (updateError) {
      throw new Error("Failed to update password");
    }

    // Sign in with the temporary password
    const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: userData.username,
      password: tempPassword
    });

    if (signInError || !signInData?.session) {
      throw new Error("Failed to sign in");
    }

    // Return the session data
    return new Response(
      JSON.stringify({ session: signInData.session }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});

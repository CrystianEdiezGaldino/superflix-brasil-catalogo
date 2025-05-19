
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

    log(`Processing login code: ${code}`);

    // Check if the code exists and is valid
    const { data: loginCode, error: codeError } = await supabaseClient
      .from("login_codes")
      .select("id, code, user_id, status")
      .eq("code", code)
      .single();

    if (codeError || !loginCode?.user_id) {
      log(`Invalid code or error: ${codeError?.message || "No user_id found"}`, { loginCode }, true);
      throw new Error("Invalid code");
    }

    log(`Found valid login code for user ${loginCode.user_id}`);

    // Get the user's username (email) from profiles table
    const { data: userData, error: userError } = await supabaseClient
      .from("profiles")
      .select("username")
      .eq("id", loginCode.user_id)
      .single();

    if (userError || !userData?.username) {
      log(`User not found: ${userError?.message || "No username found"}`, { userData }, true);
      throw new Error("User not found");
    }

    log(`Found user data with username: ${userData.username}`);

    // Generate a session for the user directly
    const { data: sessionData, error: sessionError } = await supabaseClient.auth.admin.generateLink({
      type: 'magiclink',
      email: userData.username, // Use username as the email
    });

    if (sessionError || !sessionData) {
      log(`Failed to generate session: ${sessionError?.message}`, { sessionError }, true);
      throw new Error("Failed to generate session");
    }

    log(`Generated session successfully`);

    // Return the session data for client-side use
    return new Response(
      JSON.stringify({ 
        session: sessionData.properties 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    log(`Error in quick-login function: ${errorMessage}`, { error }, true);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});

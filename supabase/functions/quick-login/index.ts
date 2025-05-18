
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { nanoid } from "https://esm.sh/nanoid@5.0.4";

// Updated CORS headers to allow requests from any origin
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

// Log function for easier debugging
const log = (message: string, data?: any) => {
  console.log(`[QUICK-LOGIN] ${message}`, data ? JSON.stringify(data) : "");
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    let body;
    try {
      body = await req.json();
    } catch (e) {
      log("Error parsing request body", e);
      throw new Error("Invalid request body");
    }

    const { action, code, deviceInfo } = body;
    log(`Processing ${action} request`, { code: code?.substring(0, 2) + "****", hasDeviceInfo: !!deviceInfo });

    switch (action) {
      case "generate": {
        // Generate a new login code
        const loginCode = nanoid(6).toUpperCase();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5 minutes expiration

        log("Generating new code", { expiresAt });

        const { data, error } = await supabaseClient
          .from("login_codes")
          .insert({
            code: loginCode,
            expires_at: expiresAt.toISOString(),
            device_info: deviceInfo
          })
          .select()
          .single();

        if (error) {
          log("Error inserting login code", error);
          throw error;
        }

        log("Code generated successfully");
        return new Response(
          JSON.stringify({ code: loginCode, expiresAt: expiresAt.toISOString() }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "validate": {
        // Validate and consume a login code
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
          log("Missing authorization header");
          throw new Error("No authorization header provided");
        }

        const token = authHeader.replace("Bearer ", "");
        const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
        if (userError) {
          log("Authentication error", userError);
          throw new Error(`Authentication error: ${userError.message}`);
        }
        
        const user = userData.user;
        if (!user?.id) {
          log("User not authenticated");
          throw new Error("User not authenticated");
        }

        log("User authenticated, validating code", { userId: user.id });

        // Find and validate the code
        const { data: loginCode, error: codeError } = await supabaseClient
          .from("login_codes")
          .select("*")
          .eq("code", code)
          .single();

        if (codeError || !loginCode) {
          log("Invalid or expired code", codeError);
          throw new Error("Invalid or expired code");
        }

        if (loginCode.used) {
          log("Code already used");
          throw new Error("Code has already been used");
        }

        if (new Date(loginCode.expires_at) < new Date()) {
          log("Code expired");
          throw new Error("Code has expired");
        }

        log("Code valid, updating with user ID");

        // Update the code with the user's ID and mark as used
        const { error: updateError } = await supabaseClient
          .from("login_codes")
          .update({
            user_id: user.id,
            used: true
          })
          .eq("id", loginCode.id);

        if (updateError) {
          log("Error updating login code", updateError);
          throw updateError;
        }

        log("Code validated successfully");
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "check": {
        // Check if a code has been validated
        log("Checking code status", { code: code?.substring(0, 2) + "****" });
        
        const { data: loginCode, error: codeError } = await supabaseClient
          .from("login_codes")
          .select("*")
          .eq("code", code)
          .single();

        if (codeError || !loginCode) {
          log("Invalid or expired code", codeError);
          return new Response(
            JSON.stringify({ status: "invalid" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (new Date(loginCode.expires_at) < new Date()) {
          log("Code expired");
          return new Response(
            JSON.stringify({ status: "expired" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (!loginCode.user_id) {
          log("Code pending validation");
          return new Response(
            JSON.stringify({ status: "pending" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        log("Code validated, getting user session", { userId: loginCode.user_id });

        // Get the user's session
        const { data: sessionData, error: sessionError } = await supabaseClient.auth.admin.createSession({
          user_id: loginCode.user_id
        });

        if (sessionError) {
          log("Error creating session", sessionError);
          throw sessionError;
        }

        log("Session created successfully");
        return new Response(
          JSON.stringify({
            status: "validated",
            user: sessionData.user,
            session: sessionData.session
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        log("Invalid action", { action });
        throw new Error("Invalid action");
    }
  } catch (error) {
    log("Error processing request", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

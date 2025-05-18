/// <reference path="./types.d.ts" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, ExtendedGoTrueAdminApi } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { nanoid } from "https://esm.sh/nanoid@4.0.2";

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
    
    if (!supabaseUrl || !supabaseServiceKey) {
      log("Missing Supabase environment variables", {}, true);
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    let body;
    try {
      body = await req.json();
    } catch (e) {
      log("Error parsing request body", e, true);
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, code, deviceInfo } = body;
    log(`Processing ${action} request`, { 
      code: code ? `${code.substring(0, 2)}****` : undefined, 
      hasDeviceInfo: !!deviceInfo 
    });

    switch (action) {
      case "generate": {
        // Generate a new login code using only alphanumeric characters
        const loginCode = generateAlphanumericCode(6);
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5 minutes expiration

        log("Generating new code", { expiresAt });

        const { error } = await supabaseClient
          .from("login_codes")
          .insert({
            code: loginCode,
            expires_at: expiresAt.toISOString(),
            device_info: deviceInfo,
            status: 'pending',
            used: false
          })
          .select()
          .single();

        if (error) {
          log("Error inserting login code", error, true);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        log("Code generated successfully");
        return new Response(
          JSON.stringify({ code: loginCode, expiresAt: expiresAt.toISOString() }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "validate": {
        // Validate and consume a login code - this is called from the device with the code
        let userId;
        
        // First check if we have an auth header (user is already authenticated)
        const authHeader = req.headers.get("Authorization");
        
        if (!authHeader) {
          log("No Authorization header provided", {}, true);
          return new Response(
            JSON.stringify({ error: "Authentication required" }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        try {
          const token = authHeader.replace("Bearer ", "");
          log("Validating token", { token: token.substring(0, 10) + "..." });
          
          const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
          
          if (userError) {
            log("Error validating token", userError, true);
            return new Response(
              JSON.stringify({ error: "Invalid authentication token" }),
              { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          
          if (!userData.user?.id) {
            log("No user ID in token data", {}, true);
            return new Response(
              JSON.stringify({ error: "Invalid user data in token" }),
              { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          userId = userData.user.id;
          log("User authenticated successfully", { userId });
        } catch (authError) {
          log("Error processing auth token", authError, true);
          return new Response(
            JSON.stringify({ error: "Error processing authentication token" }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (!code) {
          return new Response(
            JSON.stringify({ error: "Code is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        try {
          log("Finding and validating code", { userId, code: code.substring(0, 2) + "****" });

          // Find and validate the code
          const { data: loginCode, error: codeError } = await supabaseClient
            .from("login_codes")
            .select("*")
            .eq("code", code.toUpperCase())
            .single();

          if (codeError || !loginCode) {
            log("Invalid or expired code", codeError, true);
            return new Response(
              JSON.stringify({ error: "Invalid or expired code" }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          if (loginCode.used) {
            log("Code already used", {}, true);
            return new Response(
              JSON.stringify({ error: "Code has already been used" }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          if (new Date(loginCode.expires_at) < new Date()) {
            log("Code expired", {}, true);
            return new Response(
              JSON.stringify({ error: "Code has expired" }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          log("Code valid, updating with user ID", { userId });

          // Update the code with the user's ID and mark as used
          const { error: updateError } = await supabaseClient
            .from("login_codes")
            .update({
              user_id: userId,
              used: true,
              status: 'validated',
              validated_at: new Date().toISOString()
            })
            .eq("id", loginCode.id);

          if (updateError) {
            log("Error updating login code", updateError, true);
            return new Response(
              JSON.stringify({ error: updateError.message }),
              { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Create a new access record for the user
          const { error: accessError } = await supabaseClient
            .from("device_access")
            .insert({
              user_id: userId,
              device_info: loginCode.device_info,
              created_at: new Date().toISOString()
            });

          if (accessError) {
            log("Error creating device access record", accessError, true);
            // Don't return error here as the code was already validated
          }

          log("Code validated successfully", { userId });
          return new Response(
            JSON.stringify({ status: "success" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } catch (error) {
          log("Unexpected error in validate action", error, true);
          return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case "check": {
        // Check if a code has been validated - this is called from the device that generated the code
        log("Checking code status", { code: code?.substring(0, 2) + "****" });
        
        if (!code) {
          return new Response(
            JSON.stringify({ error: "Code is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        try {
          const { data: loginCode, error: codeError } = await supabaseClient
            .from("login_codes")
            .select("*")
            .eq("code", code)
            .single();

          if (codeError) {
            log("Error finding code", codeError, true);
            return new Response(
              JSON.stringify({ status: "invalid" }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          if (!loginCode) {
            log("Code not found", {}, true);
            return new Response(
              JSON.stringify({ status: "invalid" }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          if (new Date(loginCode.expires_at) < new Date()) {
            log("Code expired during check", {}, true);
            // Update status to expired
            await supabaseClient
              .from("login_codes")
              .update({ status: 'expired' })
              .eq("id", loginCode.id);
              
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

          try {
            // Get the user's session
            const { data: sessionData, error: sessionError } = await (supabaseClient.auth.admin as ExtendedGoTrueAdminApi).createSession({
              user_id: loginCode.user_id,
              refresh_token: null
            });

            if (sessionError) {
              log("Error creating session", sessionError, true);
              return new Response(
                JSON.stringify({ error: sessionError.message }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
              );
            }

            if (!sessionData) {
              log("No session data returned", {}, true);
              return new Response(
                JSON.stringify({ error: "Failed to create session" }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
              );
            }

            log("Session created successfully", { 
              userId: sessionData.user.id,
              sessionId: sessionData.session.id 
            });

            // Return the session data
            return new Response(
              JSON.stringify({
                status: "validated",
                user: {
                  id: sessionData.user.id,
                  email: sessionData.user.email,
                  user_metadata: sessionData.user.user_metadata
                },
                session: {
                  access_token: sessionData.session.access_token,
                  refresh_token: sessionData.session.refresh_token,
                  expires_at: sessionData.session.expires_at
                }
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          } catch (sessionError) {
            log("Error creating session", sessionError, true);
            return new Response(
              JSON.stringify({ error: "Failed to create session" }),
              { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        } catch (error) {
          log("Unexpected error in check action", error, true);
          return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      default:
        log("Invalid action", { action }, true);
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log("Error processing request", error, true);
    return new Response(
      JSON.stringify({ error: errorMessage || "Unknown error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

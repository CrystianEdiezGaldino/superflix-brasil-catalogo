
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { nanoid } from "https://esm.sh/nanoid@5.0.4";

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
        
        if (authHeader) {
          try {
            const token = authHeader.replace("Bearer ", "");
            const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
            
            if (!userError && userData.user?.id) {
              userId = userData.user.id;
              log("User authenticated via token", { userId });
            } else {
              log("Invalid auth token", userError, true);
              // Continue without user ID, we'll return a proper error later if needed
            }
          } catch (authError) {
            log("Error processing auth token", authError, true);
            // Continue without user ID, we'll return a proper error later if needed
          }
        }
        
        if (!userId) {
          log("No valid user authentication for validation", {}, true);
          return new Response(
            JSON.stringify({ error: "Authentication required" }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (!code) {
          return new Response(
            JSON.stringify({ error: "Code is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        log("Finding and validating code", { userId });

        // Find and validate the code
        const { data: loginCode, error: codeError } = await supabaseClient
          .from("login_codes")
          .select("*")
          .eq("code", code)
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
            used: true
          })
          .eq("id", loginCode.id);

        if (updateError) {
          log("Error updating login code", updateError, true);
          return new Response(
            JSON.stringify({ error: updateError.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        log("Code validated successfully");
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
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
        
        const { data: loginCode, error: codeError } = await supabaseClient
          .from("login_codes")
          .select("*")
          .eq("code", code)
          .single();

        if (codeError) {
          log("Invalid or expired code during check", codeError, true);
          return new Response(
            JSON.stringify({ status: "invalid" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (new Date(loginCode.expires_at) < new Date()) {
          log("Code expired during check", {}, true);
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
          log("Error creating session", sessionError, true);
          return new Response(
            JSON.stringify({ error: sessionError.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
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

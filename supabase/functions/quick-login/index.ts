import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { nanoid } from "https://esm.sh/nanoid@5.0.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    const { action, code, deviceInfo } = await req.json();

    switch (action) {
      case "generate": {
        // Generate a new login code
        const loginCode = nanoid(6).toUpperCase();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5 minutes expiration

        const { data, error } = await supabaseClient
          .from("login_codes")
          .insert({
            code: loginCode,
            expires_at: expiresAt.toISOString(),
            device_info: deviceInfo
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ code: loginCode, expiresAt: expiresAt.toISOString() }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "validate": {
        // Validate and consume a login code
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) throw new Error("No authorization header provided");

        const token = authHeader.replace("Bearer ", "");
        const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
        if (userError) throw new Error(`Authentication error: ${userError.message}`);
        
        const user = userData.user;
        if (!user?.id) throw new Error("User not authenticated");

        // Find and validate the code
        const { data: loginCode, error: codeError } = await supabaseClient
          .from("login_codes")
          .select("*")
          .eq("code", code)
          .single();

        if (codeError || !loginCode) {
          throw new Error("Invalid or expired code");
        }

        if (loginCode.used) {
          throw new Error("Code has already been used");
        }

        if (new Date(loginCode.expires_at) < new Date()) {
          throw new Error("Code has expired");
        }

        // Update the code with the user's ID and mark as used
        const { error: updateError } = await supabaseClient
          .from("login_codes")
          .update({
            user_id: user.id,
            used: true
          })
          .eq("id", loginCode.id);

        if (updateError) throw updateError;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "check": {
        // Check if a code has been validated
        const { data: loginCode, error: codeError } = await supabaseClient
          .from("login_codes")
          .select("*")
          .eq("code", code)
          .single();

        if (codeError || !loginCode) {
          throw new Error("Invalid or expired code");
        }

        if (new Date(loginCode.expires_at) < new Date()) {
          throw new Error("Code has expired");
        }

        if (!loginCode.user_id) {
          return new Response(
            JSON.stringify({ status: "pending" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Get the user's session
        const { data: session, error: sessionError } = await supabaseClient.auth.admin.getUserById(
          loginCode.user_id
        );

        if (sessionError) throw sessionError;

        return new Response(
          JSON.stringify({
            status: "validated",
            user: session.user,
            session: session.session
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        throw new Error("Invalid action");
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}); 
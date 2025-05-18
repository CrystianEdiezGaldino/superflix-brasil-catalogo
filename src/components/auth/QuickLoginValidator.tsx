import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const validateCode = async (code: string) => {
  try {
    console.log("Attempting to validate code:", code);
    
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("No active session found");
    }

    console.log("Using session token:", session.access_token);
    
    // Call the Edge Function to validate the code
    const { data, error } = await supabase.functions.invoke('quick-login', {
      body: {
        action: 'validate',
        code
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (error) {
      console.error("Error validating code:", error);
      throw error;
    }

    console.log("Code validation response:", data);
    return data;
  } catch (error) {
    console.error("Error in validateCode:", error);
    throw error;
  }
}; 
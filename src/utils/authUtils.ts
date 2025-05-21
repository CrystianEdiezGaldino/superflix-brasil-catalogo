
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Signs up a new user with email and password
 */
export const signUpUser = async (email: string, password: string, metadata?: { [key: string]: any }) => {
  try {
    console.log("Attempting signup for:", email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: window.location.origin + '/auth'
      }
    });
    
    if (error) {
      console.error("Signup error:", error);
      throw error;
    }
    
    console.log("Signup successful for:", email, "User data:", data);
    
    // Create a profile for the user manually to ensure it exists
    if (data.user) {
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ 
            id: data.user.id,
            username: email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (profileError) {
          console.warn("Error creating profile:", profileError);
        }
      } catch (profileException) {
        console.warn("Exception when creating profile:", profileException);
        // Non-critical, continue with signup
      }
    }
    
    // Call auth webhook to create trial subscription
    try {
      const webhookResponse = await fetch(`https://juamkehykcohwufehqfv.supabase.co/functions/v1/auth-webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.session?.access_token || ''}`,
        },
        body: JSON.stringify({
          type: 'signup',
          email: email,
          user_id: data.user?.id
        }),
      });
      
      if (!webhookResponse.ok) {
        console.warn("Trial subscription creation may have failed:", await webhookResponse.text());
      } else {
        console.log("Trial subscription webhook response:", await webhookResponse.json());
      }
    } catch (webhookError) {
      console.warn("Error calling auth webhook:", webhookError);
      // Non-critical error, don't throw
    }
    
    toast.success("Cadastro realizado! Por favor, faça login.");
    return data;
  } catch (error: any) {
    console.error("Error during signup:", error);
    toast.error(error.message || "Erro ao cadastrar");
    throw error;
  }
};

/**
 * Signs in a user with email and password
 */
export const signInUser = async (email: string, password: string) => {
  try {
    console.log("Attempting login for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Login error:", error);
      throw error;
    }
    
    console.log("Login successful for:", email, "User data:", data.user);
    
    return data;
  } catch (error: any) {
    console.error("Error during login:", error);
    toast.error(error.message || "Erro ao fazer login");
    throw error;
  }
};

/**
 * Signs out the current user
 */
export const signOutUser = async () => {
  try {
    console.log("Attempting to sign out");
    
    // First, get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("No active session found, proceeding with sign out");
    }
    
    // Sign out
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error);
      throw error;
    }
    
    // Clear any local storage items that might be related to the session
    localStorage.removeItem('supabase.auth.token');
    
    console.log("Sign out successful");
  } catch (error: any) {
    console.error("Error during sign out:", error);
    toast.error(error.message || "Erro ao sair");
    throw error;
  }
};

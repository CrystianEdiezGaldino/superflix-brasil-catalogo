import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Signs up a new user
 */
export const signUpUser = async (email: string, password: string, metadata?: { [key: string]: any }) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
    
    // Store session in localStorage if available
    if (data.session) {
      localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
    }
    
    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error("Error signing up:", error);
    return { user: null, session: null, error };
  }
};

/**
 * Signs in an existing user
 */
export const signInUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Store session in localStorage if available
    if (data.session) {
      localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
    }
    
    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error("Error signing in:", error);
    return { user: null, session: null, error };
  }
};

/**
 * Signs out the current user
 */
export const signOutUser = async () => {
  try {
    // First, clear any local caches
    localStorage.removeItem('subscription_status');
    
    // Then sign out via Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    // Show success message
    toast.success("Logout realizado com sucesso!");
    
    // Reload the page to ensure all user state is cleared
    setTimeout(() => {
      window.location.href = '/auth'; // Redirect to auth page
    }, 500);
    
    return { error: null };
  } catch (error) {
    console.error("Error signing out:", error);
    toast.error("Erro ao fazer logout. Tente novamente.");
    return { error };
  }
};

/**
 * Resets a user's password
 */
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { error };
  }
};

/**
 * Gets the current user session
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    return { session: data.session, error: null };
  } catch (error) {
    console.error("Error getting session:", error);
    return { session: null, error };
  }
};

/**
 * Refreshes the current user session
 */
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) throw error;
    
    return { session: data.session, user: data.user, error: null };
  } catch (error) {
    console.error("Error refreshing session:", error);
    return { session: null, user: null, error };
  }
};

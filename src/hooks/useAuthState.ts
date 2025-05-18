
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Custom hook to manage authentication state
 */
export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibilityChanged, setVisibilityChanged] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [lastAuthEvent, setLastAuthEvent] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true; // For cleanup/preventing state updates after unmount

    // Set up auth state listener first - IMPORTANT: this sets up the listener before anything else
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (!isActive) return; // Don't update state if component unmounted
        
        console.log("Auth state changed:", event);
        setLastAuthEvent(event);
        
        // Skip redundant updates and UI refreshes when just returning from tab switch
        if (visibilityChanged && event === "INITIAL_SESSION" && newSession?.user?.id === user?.id) {
          console.log("Skipping redundant auth update after tab switch");
          return;
        }
        
        // Only update state if actually changed to prevent unnecessary re-renders
        const userChanged = newSession?.user?.id !== user?.id;
        const sessionChanged = newSession?.access_token !== session?.access_token;
        
        if (userChanged || sessionChanged) {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          // Only show toast for actual login events, not restoration of session
          if (event === "SIGNED_IN" && !sessionChecked) {
            console.log("User signed in:", newSession?.user?.email);
            toast.success("Login realizado com sucesso!");
          }
          
          if (event === "SIGNED_OUT") {
            console.log("User signed out");
            toast.info("Você saiu da sua conta");
          }
        }
        
        // Set loading to false regardless of whether state was updated
        if (loading && event !== "INITIAL_SESSION") {
          setLoading(false);
        }
      }
    );

    // Get initial session state - do this after setting up the listener
    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (!isActive) return; // Don't update state if component unmounted
      
      if (error) {
        console.error("Error getting session:", error);
        setLoading(false);
        return;
      }
      
      console.log("Initial session check:", currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setSessionChecked(true);
      setLoading(false);
    });

    return () => {
      isActive = false; // Mark as inactive
      subscription.unsubscribe();
    };
  }, []);  // Remove dependencies to prevent loop

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && visibilityChanged) {
        // Tab became visible again - flag that we're returning from a tab switch
        setVisibilityChanged(false);
        console.log("Tab visible again, maintaining session state");
      } else if (document.visibilityState === 'hidden') {
        // Tab hidden - store this fact but don't refresh
        setVisibilityChanged(true);
        console.log("Tab hidden, maintaining session state");
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [visibilityChanged]);

  return { user, session, loading, lastAuthEvent };
};

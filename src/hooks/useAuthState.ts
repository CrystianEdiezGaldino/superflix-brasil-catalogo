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
    let isActive = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (!isActive) return;
        
        console.log("Auth state changed:", event);
        setLastAuthEvent(event);
        
        if (visibilityChanged && event === "INITIAL_SESSION" && newSession?.user?.id === user?.id) {
          console.log("Skipping redundant auth update after tab switch");
          return;
        }
        
        const userChanged = newSession?.user?.id !== user?.id;
        const sessionChanged = newSession?.access_token !== session?.access_token;
        
        if (userChanged || sessionChanged) {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          if (event === "SIGNED_IN" && !sessionChecked) {
            console.log("User signed in:", newSession?.user?.email);
            toast.success("Login realizado com sucesso!");
          }
          
          if (event === "SIGNED_OUT") {
            console.log("User signed out");
            toast.info("Você saiu da sua conta");
          }
        }
        
        if (loading && event !== "INITIAL_SESSION") {
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (!isActive) return;
      
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
      isActive = false;
      subscription.unsubscribe();
    };
  }, [user?.id, session?.access_token, visibilityChanged, sessionChecked, loading]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && visibilityChanged) {
        setVisibilityChanged(false);
        console.log("Tab visible again, maintaining session state");
      } else if (document.visibilityState === 'hidden') {
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

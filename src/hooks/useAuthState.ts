import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Custom hook to manage authentication state
 */
export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibilityChanged, setVisibilityChanged] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [lastAuthEvent, setLastAuthEvent] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

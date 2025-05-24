
import React, { useState, useEffect } from "react";
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
    const initializeSession = async () => {
      try {
        // First try to get session from localStorage
        const storedSession = localStorage.getItem('supabase.auth.token');
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          setSession(parsedSession);
          setUser(parsedSession?.user ?? null);
        }

        // Then get fresh session from Supabase
        const { data: { session: freshSession } } = await supabase.auth.getSession();
        if (freshSession) {
          setSession(freshSession);
          setUser(freshSession.user);
          localStorage.setItem('supabase.auth.token', JSON.stringify(freshSession));
        }
      } catch (error) {
        console.error('Error initializing session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLastAuthEvent(event);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session) {
        localStorage.setItem('supabase.auth.token', JSON.stringify(session));
      } else {
        localStorage.removeItem('supabase.auth.token');
      }
      
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
        // Refresh session when tab becomes visible again
        supabase.auth.refreshSession().catch(console.error);
      } else if (document.visibilityState === 'hidden') {
        setVisibilityChanged(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [visibilityChanged]);

  return { user, session, loading, lastAuthEvent };
};

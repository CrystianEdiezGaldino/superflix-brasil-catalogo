
import { createContext, useContext, ReactNode, useMemo, useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useAuthState } from "@/hooks/useAuthState";
import { signUpUser, signInUser, signOutUser } from "@/utils/authUtils";
import { supabase } from "@/integrations/supabase/client";
import { cacheManager } from "@/utils/cacheManager";

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Cache key para o estado de autenticação
const AUTH_CACHE_KEY = "auth_state";
const AUTH_CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, session, loading } = useAuthState();
  const [authInitialized, setAuthInitialized] = useState(false);
  
  // Atualiza o cache quando o estado de autenticação muda
  useEffect(() => {
    if (!loading && authInitialized) {
      const authState = { 
        hasUser: !!user, 
        sessionExists: !!session
      };
      cacheManager.set(AUTH_CACHE_KEY, authState, AUTH_CACHE_DURATION);
    }
  }, [user, session, loading, authInitialized]);

  // Marca a inicialização do auth após o primeiro carregamento
  useEffect(() => {
    if (!loading) {
      setAuthInitialized(true);
    }
  }, [loading]);
  
  // Memoize auth functions to prevent unnecessary re-renders
  const authValues = useMemo(() => {
    const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
      await signUpUser(email, password, metadata);
    };
    
    const signIn = async (email: string, password: string) => {
      return await signInUser(email, password);
    };
    
    const signOut = async () => {
      await signOutUser();
      // Limpar o cache ao fazer logout
      cacheManager.remove(AUTH_CACHE_KEY);
    };

    const resetPassword = async (email: string) => {
      // Usa o domínio do Lovable
      const siteUrl = window.location.origin || "https://naflixtv.lovable.app";
      
      // Configura o link de redirecionamento
      const redirectTo = `${siteUrl}/auth/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      
      if (error) {
        throw error;
      }
    };

    const login = async (email: string, password: string) => {
      return await signInUser(email, password);
    };

    const register = async (email: string, password: string, name: string) => {
      await signUpUser(email, password, { name });
    };
    
    return {
      session,
      user,
      signUp,
      signIn,
      signOut,
      resetPassword,
      loading,
      login,
      register
    };
  }, [session, user, loading]);
  
  // Log apenas em desenvolvimento e só quando realmente necessário
  if (import.meta.env.DEV && !loading && authInitialized) {
    console.log("AuthContext state:", { 
      hasUser: !!user, 
      isLoading: loading, 
      sessionExists: !!session
    });
  }
  
  return (
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

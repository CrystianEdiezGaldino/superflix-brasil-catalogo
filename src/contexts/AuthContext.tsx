
import { createContext, useContext, ReactNode, useMemo } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useAuthState } from "@/hooks/useAuthState";
import { signUpUser, signInUser, signOutUser } from "@/utils/authUtils";
import { supabase } from "@/integrations/supabase/client";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, session, loading } = useAuthState();
  
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
    };

    const resetPassword = async (email: string) => {
      // Usa o domínio do Lovable
      const siteUrl = "https://naflixtv.lovable.app";
      
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
  
  // Debug log to help trace auth issues
  console.log("AuthContext state:", { 
    hasUser: !!user, 
    isLoading: loading, 
    sessionExists: !!session
  });
  
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

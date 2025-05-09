
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner"; // Use only sonner toast

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.email);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (event === "SIGNED_IN") {
          console.log("User signed in:", newSession?.user?.email);
          toast.success("Login realizado com sucesso!");
        }
        
        if (event === "SIGNED_OUT") {
          console.log("User signed out");
          toast.info("Você saiu da sua conta");
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
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
    } catch (error: any) {
      console.error("Error during signup:", error);
      toast.error(error.message || "Erro ao cadastrar");
      throw error;
    }
  };
  
  const signIn = async (email: string, password: string) => {
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
  
  const signOut = async () => {
    try {
      console.log("Attempting to sign out");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      console.log("Sign out successful");
    } catch (error: any) {
      console.error("Error during sign out:", error);
      toast.error(error.message || "Erro ao sair");
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider value={{
      session,
      user,
      signUp,
      signIn,
      signOut,
      loading
    }}>
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

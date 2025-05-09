
import { createContext, useContext, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useAuthState } from "@/hooks/useAuthState";
import { signUpUser, signInUser, signOutUser } from "@/utils/authUtils";

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, session, loading } = useAuthState();
  
  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    await signUpUser(email, password, metadata);
  };
  
  const signIn = async (email: string, password: string) => {
    return await signInUser(email, password);
  };
  
  const signOut = async () => {
    await signOutUser();
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

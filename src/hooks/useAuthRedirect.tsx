
import { useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";

export const useAuthRedirect = (user: User | null, authLoading: boolean) => {
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("É necessário fazer login para acessar o conteúdo");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);
};

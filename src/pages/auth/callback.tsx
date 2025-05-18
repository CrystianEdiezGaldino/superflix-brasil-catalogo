import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Erro ao obter sessão:", error);
          toast.error("Erro ao fazer login");
          navigate("/auth");
          return;
        }

        if (session) {
          console.log("Login realizado com sucesso!");
          toast.success("Login realizado com sucesso!");
          navigate("/");
        } else {
          console.error("Nenhuma sessão encontrada");
          toast.error("Erro ao fazer login");
          navigate("/auth");
        }
      } catch (err) {
        console.error("Erro inesperado:", err);
        toast.error("Ocorreu um erro inesperado");
        navigate("/auth");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processando login...</h1>
        <p className="text-gray-500">Por favor, aguarde enquanto finalizamos seu login.</p>
      </div>
    </div>
  );
} 
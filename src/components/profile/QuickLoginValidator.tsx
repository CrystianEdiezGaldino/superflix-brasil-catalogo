
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const QuickLoginValidator = () => {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = async () => {
    // For testing, only accept the fixed code
    if (code !== "MV65VP") {
      toast.error("Código inválido");
      return;
    }

    console.log("[QuickLoginValidator] Iniciando validação do código fixo: MV65VP");
    setIsValidating(true);
    try {
      // Buscar o código na tabela
      console.log("[QuickLoginValidator] Buscando código na tabela...");
      const { data: loginCode, error: codeError } = await supabase
        .from("login_codes")
        .select("id, code, user_id, status")
        .eq("code", "MV65VP")
        .single();

      console.log("[QuickLoginValidator] Resposta da busca do código:", { loginCode, codeError });

      if (codeError || !loginCode) {
        console.error("[QuickLoginValidator] Erro ao buscar código:", codeError);
        toast.error("Código inválido");
        return;
      }

      if (loginCode.status === 'expired') {
        console.log("[QuickLoginValidator] Código expirado");
        toast.error("Código expirado");
        return;
      }

      if (loginCode.status === 'validated' && loginCode.user_id) {
        console.log("[QuickLoginValidator] Código validado, user_id:", loginCode.user_id);
        
        // Buscar o usuário diretamente pela API do Supabase Auth
        console.log("[QuickLoginValidator] Buscando dados do usuário...");
        const { data: userData, error: userError } = await supabase.auth.getUser(loginCode.user_id);

        console.log("[QuickLoginValidator] Dados do usuário:", { userData, userError });

        if (userError || !userData?.user?.email) {
          console.error("[QuickLoginValidator] Erro ao buscar dados do usuário:", userError);
          toast.error("Erro ao buscar dados do usuário");
          return;
        }

        // Fazer login com o email do usuário que validou
        console.log("[QuickLoginValidator] Tentando fazer login com o email:", userData.user.email);
        const { data: signInData, error: signInError } = await supabase.auth.signInWithOtp({
          email: userData.user.email,
          options: {
            shouldCreateUser: false
          }
        });

        console.log("[QuickLoginValidator] Resposta do login:", { 
          hasSignInData: !!signInData,
          signInError
        });

        if (signInError) {
          console.error("[QuickLoginValidator] Erro ao fazer login:", signInError);
          toast.error("Erro ao fazer login");
          return;
        }

        // Atualizar o código para marcar como usado
        console.log("[QuickLoginValidator] Atualizando status do código...");
        const { error: updateError } = await supabase
          .from('login_codes')
          .update({ 
            used: true,
            status: 'validated',
            validated_at: new Date().toISOString()
          })
          .eq('code', "MV65VP");

        console.log("[QuickLoginValidator] Resposta da atualização:", { updateError });

        if (updateError) {
          console.error("[QuickLoginValidator] Erro ao atualizar código:", updateError);
          toast.error("Erro ao atualizar código");
          return;
        }

        console.log("[QuickLoginValidator] Login realizado com sucesso!");
        toast.success("Login realizado com sucesso!");
        window.location.reload();
      } else {
        console.log("[QuickLoginValidator] Código inválido ou expirado:", loginCode);
        toast.error("Código inválido ou expirado");
      }
    } catch (error) {
      console.error("[QuickLoginValidator] Erro não tratado:", error);
      toast.error("Erro ao validar código");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card className="bg-black/75 border-gray-800">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-white">Validar Acesso Rápido</h3>
            <p className="text-sm text-gray-400">Digite o código de acesso gerado no outro dispositivo</p>
          </div>

          <div className="space-y-2">
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Digite o código"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <Button
            onClick={handleValidate}
            disabled={isValidating}
            className="w-full bg-netflix-red hover:bg-red-700"
          >
            {isValidating ? "Validando..." : "Validar Código"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

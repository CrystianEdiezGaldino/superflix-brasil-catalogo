
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Download } from "lucide-react";

interface SignupFormProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onSuccess: () => void;
}

const SignupForm = ({ isLoading, setIsLoading, onSuccess }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setIsLoading(true);
    
    try {
      // Criar conta
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;

      // Verificar se o usuário foi criado com sucesso
      if (!data.user) {
        throw new Error("Falha ao criar conta de usuário");
      }

      console.log("Conta criada com sucesso:", data.user.id);
      
      // Se tiver código promocional, tentar resgatar
      let codeRedeemed = false;
      if (code.trim()) {
        console.log("Tentando resgatar código promocional:", code.trim());
        
        const { data: redeemData, error: redeemError } = await supabase.rpc('redeem_promo_code', {
          code_text: code.trim()
        });

        if (redeemError) {
          console.error("Erro ao resgatar código promocional:", redeemError);
          toast.error(`Erro ao resgatar código: ${redeemError.message}`);
        } else {
          console.log("Resposta do resgate do código:", redeemData);
          
          // Processar dados do código resgatado - garantir que a verificação do tipo é feita corretamente
          if (typeof redeemData === 'object' && redeemData !== null) {
            const redeemResponse = redeemData as any;
            
            if (redeemResponse.success) {
              toast.success(`${redeemResponse.message} Você ganhou ${redeemResponse.days_valid} dias de acesso!`);
              codeRedeemed = true;
            } else {
              toast.error(redeemResponse.message || "Código inválido ou expirado");
            }
          }
        }
      }
      
      toast.success("Conta criada com sucesso! Verifique seu e-mail.");
      
      // Se tinha um código de acesso, força login para atualizar dados da assinatura
      if (codeRedeemed) {
        try {
          // Fazer login automaticamente após resgatar código
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (signInError) {
            console.warn("Erro ao fazer login automático:", signInError);
          } else {
            console.log("Login automático realizado com sucesso!");
            // Não redirecionar aqui, o sistema de autenticação cuidará disso
          }
        } catch (loginError) {
          console.error("Erro ao fazer login automático:", loginError);
        }
        
        return;
      }
      
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      toast.error(error.message || "Falha ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Criar Conta</h1>
        <p className="text-gray-400">Junte-se à nossa lista VIP e ganhe descontos especiais quando o período de lançamento terminar!</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-300">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-300">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar Senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="********"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="code" className="text-gray-300 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>Código de Acesso (Opcional)</span>
        </Label>
        <Input
          id="code"
          type="text"
          placeholder="Digite o código de acesso (opcional)"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          disabled={isLoading}
          className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red uppercase"
        />
      </div>
      
      <div className="space-y-1 mt-1 text-center">
        <p className="text-xs text-gray-500 italic">Ao se cadastrar agora, você entra para nossa lista VIP e terá descontos especiais quando a plataforma começar a fazer cobranças!</p>
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading} 
        className="w-full bg-netflix-red hover:bg-red-700"
      >
        {isLoading ? "Criando conta..." : "Criar Conta"}
      </Button>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-gray-900 text-gray-400">Ou</span>
        </div>
      </div>

      <a 
        href="/naflixtv.apk"
        download
        className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-md shadow-lg hover:shadow-xl transition-all duration-200 font-medium animate-pulse"
      >
        <Download className="text-xl" />
        <div className="flex flex-col items-start">
          <span className="text-sm font-normal">Baixar App</span>
          <span className="text-xs opacity-80">Acesso mais rápido e sem anúncios!</span>
        </div>
      </a>
    </form>
  );
};

export default SignupForm;

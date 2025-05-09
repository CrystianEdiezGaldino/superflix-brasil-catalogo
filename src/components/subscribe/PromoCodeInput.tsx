
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface PromoCodeResponse {
  success: boolean;
  message: string;
  days_valid?: number;
  trial_end?: string;
}

const PromoCodeInput = () => {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { checkSubscription } = useSubscription();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar logado para resgatar um código");
      return;
    }
    
    if (!code.trim()) {
      toast.error("Por favor, insira um código promocional");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.rpc('redeem_promo_code', {
        code_text: code.trim()
      });
      
      if (error) {
        throw error;
      }
      
      // Cast the data to our expected response type
      const response = data as unknown as PromoCodeResponse;
      
      if (!response.success) {
        toast.error(response.message || "Erro ao resgatar o código");
        return;
      }
      
      toast.success(response.message);
      // Atualizar os dados de assinatura após resgatar um código
      await checkSubscription();
      
      // Limpar o campo após sucesso
      setCode("");
    } catch (error) {
      console.error("Erro ao resgatar código promocional:", error);
      toast.error("Ocorreu um erro ao processar seu código promocional");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
      <Input
        type="text"
        placeholder="Insira seu código promocional"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="bg-gray-900 border-gray-700 text-white"
        disabled={isSubmitting}
      />
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="whitespace-nowrap"
      >
        {isSubmitting ? "Processando..." : "Resgatar Código"}
      </Button>
    </form>
  );
};

export default PromoCodeInput;


import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionPlanProps {
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  isDemoMode: boolean;
}

const SubscriptionPlans = ({ isProcessing, setIsProcessing, isDemoMode }: SubscriptionPlanProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // IDs corretos dos produtos
  const MONTHLY_PRICE_ID = "price_1Qkiz906o9nmaCFZL6CQMeEM";
  const ANNUAL_PRICE_ID = "price_1Qkj0S06o9nmaCFZHli9wwLC";
  const MONTHLY_PRODUCT_ID = "prod_SHSb9G94AXb8Nl";
  const ANNUAL_PRODUCT_ID = "prod_SHSce9XGUSazQq";
  
  const handleSubscribe = async (priceId: string, isMonthly: boolean) => {
    if (!user) {
      toast.error("Você precisa estar logado para assinar");
      navigate("/auth");
      return;
    }

    setIsProcessing(true);
    try {
      console.log("Iniciando processo de checkout com priceId:", priceId);
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId,
          mode: "subscription"
        }
      });

      console.log("Resposta do create-checkout:", data);

      if (error) {
        console.error("Erro na chamada da função create-checkout:", error);
        throw new Error(error.message || "Erro ao processar assinatura");
      }

      if (data?.error) {
        console.error("Erro retornado pelo servidor:", data.error);
        throw new Error(data.error || "Erro ao processar assinatura");
      }

      // Check if we're in demo mode (Stripe not configured)
      if (data?.demo_mode) {
        toast.error(data.error || "Sistema de pagamento em modo de demonstração");
        
        // Grant temporary access in demo mode
        await supabase.functions.invoke("grant-temp-access", {
          body: {
            userId: user.id,
            days: 30
          }
        });
        
        navigate("/subscription-success");
        return;
      }

      if (!data?.url) {
        console.error("URL não retornada:", data);
        throw new Error("URL do checkout não foi retornada. Verifique se os IDs de preço estão corretos.");
      }

      // Redirect to Stripe Checkout
      console.log("Redirecionando para URL do Stripe:", data.url);
      window.location.href = data.url;
    } catch (error) {
      let errorMessage = "Erro ao processar assinatura. Por favor, tente novamente.";
      if (error instanceof Error) {
        console.error("Erro detalhado ao criar sessão de checkout:", error);
        errorMessage = `Erro: ${error.message}`;
      }
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Monthly Plan */}
      <Card className="bg-gray-800 border-gray-700 text-white overflow-hidden relative transition-transform hover:scale-105">
        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <CardHeader className="bg-netflix-red py-6">
          <CardTitle className="text-center text-2xl">Mensal</CardTitle>
          <CardDescription className="text-white text-center text-lg">
            <span className="line-through text-gray-300">R$14,90</span>
            <span className="ml-2">R$9,90/mês</span>
          </CardDescription>
          <p className="text-center text-white text-sm mt-1">
            <span className="bg-yellow-500 text-black px-2 py-1 rounded-full">33% de desconto</span>
          </p>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
              <span>Acesso a todos os conteúdos</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
              <span>Cancele quando quiser, sem multas</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
              <span>7 dias de avaliação gratuita</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
              <span>Assista em qualquer dispositivo</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
              <span>Até 3 telas simultâneas</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full py-6 text-lg bg-netflix-red hover:bg-netflix-red/90"
            onClick={() => handleSubscribe(MONTHLY_PRICE_ID, true)}
            disabled={isProcessing}
          >
            {isProcessing ? "Processando..." : "Assinar Plano Mensal"}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Annual Plan */}
      <Card className="bg-gray-800 border-gray-700 text-white overflow-hidden relative transition-transform hover:scale-105">
        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div className="absolute -right-8 top-6 bg-green-500 text-white px-10 py-1 rotate-45 font-medium text-sm">
          Mais popular
        </div>
        <CardHeader className="bg-netflix-red py-6">
          <CardTitle className="text-center text-2xl">Anual</CardTitle>
          <CardDescription className="text-white text-center">
            <span className="line-through text-gray-300">R$178,80</span>
            <p className="text-lg">R$100/ano</p>
            <p className="text-sm mt-1">Economize R$78,80 (44% OFF)</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
              <span>Acesso a todos os conteúdos</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
              <span>Cancele quando quiser, reembolso proporcional</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
              <span>7 dias de avaliação gratuita</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
              <span>Assista em qualquer dispositivo</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
              <span>Até 6 telas simultâneas</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Economize 44% em relação ao plano mensal</strong></span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full py-6 text-lg bg-green-600 hover:bg-green-700"
            onClick={() => handleSubscribe(ANNUAL_PRICE_ID, false)}
            disabled={isProcessing}
          >
            {isProcessing ? "Processando..." : "Assinar Plano Anual"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubscriptionPlans;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Subscribe = () => {
  const { user } = useAuth();
  const { isSubscribed, subscriptionTier, isLoading, checkSubscription } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async (priceId: string, isMonthly: boolean) => {
    if (!user) {
      toast.error("Você precisa estar logado para assinar");
      navigate("/auth");
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId,
          mode: "subscription"
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Check if we're in demo mode (Stripe not configured)
      if (data.demo_mode) {
        setIsDemoMode(true);
        toast.error(data.error || "Sistema de pagamento em modo de demonstração");
        
        // Grant temporary access in demo mode
        await supabase.functions.invoke("grant-temp-access", {
          body: {
            userId: user.id,
            days: 30
          }
        });
        
        await checkSubscription();
        navigate("/subscription-success");
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Erro ao processar assinatura");
    } finally {
      setIsProcessing(false);
    }
  };

  // If already subscribed, show current plan
  if (isSubscribed && !isLoading) {
    return (
      <div className="min-h-screen bg-netflix-background">
        <Navbar onSearch={() => {}} />
        <div className="container mx-auto pt-24 px-4 pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-6">Você já possui uma assinatura ativa</h1>
            <p className="text-gray-300 mb-8">
              {subscriptionTier === "monthly" 
                ? "Você está no plano Mensal" 
                : subscriptionTier === "annual" 
                  ? "Você está no plano Anual"
                  : subscriptionTier === "temp"
                    ? "Você possui acesso temporário"
                    : "Você possui uma assinatura ativa"}
            </p>
            <Button 
              variant="default" 
              onClick={() => navigate("/profile")}
              className="px-8 py-6 text-lg"
            >
              Ir para seu perfil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={() => {}} />
      <div className="container mx-auto pt-24 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Escolha seu plano</h1>
          <p className="text-gray-300 mb-8 text-center">Cancele quando quiser. Todos os planos incluem uma avaliação gratuita de 7 dias.</p>
          
          {isDemoMode && (
            <div className="bg-yellow-600/20 border border-yellow-600 rounded-md p-4 mb-8 text-center">
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">Modo de Demonstração</h3>
              <p className="text-gray-300">
                O sistema de pagamentos está em modo de demonstração. 
                Clique em qualquer plano para receber acesso temporário gratuito por 30 dias.
              </p>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Monthly Plan */}
            <Card className="bg-gray-800 border-gray-700 text-white overflow-hidden relative">
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <CardHeader className="bg-netflix-red py-6">
                <CardTitle className="text-center text-2xl">Mensal</CardTitle>
                <CardDescription className="text-white text-center text-lg">R$9,90/mês</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 pb-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
                    <span>Acesso a todos os conteúdos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
                    <span>Assista em qualquer dispositivo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
                    <span>7 dias de avaliação gratuita</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full py-6 text-lg"
                  onClick={() => handleSubscribe("price_monthly", true)}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processando..." : "Assinar Plano Mensal"}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Annual Plan */}
            <Card className="bg-gray-800 border-gray-700 text-white overflow-hidden relative">
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
                  <p className="text-lg">R$100/ano</p>
                  <p className="text-sm mt-1">Economize R$18,80</p>
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
                    <span>Assista em qualquer dispositivo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
                    <span>7 dias de avaliação gratuita</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
                    <span><strong>Economize 16% em relação ao plano mensal</strong></span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full py-6 text-lg"
                  onClick={() => handleSubscribe("price_annual", false)}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processando..." : "Assinar Plano Anual"}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <p className="text-gray-400 text-sm mt-8 text-center">
            Ao assinar, você concorda com os Termos de Serviço e nossa Política de Privacidade.
            Você poderá cancelar sua assinatura a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;

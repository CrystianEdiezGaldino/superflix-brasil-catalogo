
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Film, Tv, Globe, Smartphone, Laptop, Monitor, Award, Star } from "lucide-react";
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="default" 
                onClick={() => navigate("/")}
                className="px-8 py-6 text-lg"
              >
                Explorar Conteúdos
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate("/profile")}
                className="px-8 py-6 text-lg"
              >
                Gerenciar Assinatura
              </Button>
            </div>
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
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-4">Assine por menos de um café por dia</h1>
            <p className="text-xl text-gray-300 mb-8">Tudo em um só lugar por um preço acessível. <span className="text-netflix-red font-semibold">Cancele quando quiser.</span></p>
            <div className="bg-gradient-to-r from-netflix-red/20 to-purple-700/20 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Por que escolher nossa plataforma?</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center">
                  <div className="bg-netflix-red rounded-full p-3 mb-3">
                    <Award size={24} className="text-white" />
                  </div>
                  <span className="text-white text-sm">Conteúdo exclusivo</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-netflix-red rounded-full p-3 mb-3">
                    <Monitor size={24} className="text-white" />
                  </div>
                  <span className="text-white text-sm">Qualidade até 4K</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-netflix-red rounded-full p-3 mb-3">
                    <Globe size={24} className="text-white" />
                  </div>
                  <span className="text-white text-sm">Sem restrições</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-netflix-red rounded-full p-3 mb-3">
                    <Star size={24} className="text-white" />
                  </div>
                  <span className="text-white text-sm">Mais barato do mercado</span>
                </div>
              </div>
            </div>
          </div>
          
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
                    <span>Sem limites de telas simultâneas</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full py-6 text-lg bg-netflix-red hover:bg-netflix-red/90"
                  onClick={() => handleSubscribe("price_monthly", true)}
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
                    <span>Sem limites de telas simultâneas</span>
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
                  onClick={() => handleSubscribe("price_annual", false)}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processando..." : "Assinar Plano Anual"}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-12 bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Nosso conteúdo para todos os gostos</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
              <div className="flex flex-col items-center text-gray-300 hover:text-white">
                <Film size={28} className="mb-2" />
                <span className="text-sm">Filmes</span>
              </div>
              <div className="flex flex-col items-center text-gray-300 hover:text-white">
                <Tv size={28} className="mb-2" />
                <span className="text-sm">Séries</span>
              </div>
              <div className="flex flex-col items-center text-gray-300 hover:text-white">
                <div className="mb-2 text-2xl">🎭</div>
                <span className="text-sm">Doramas</span>
              </div>
              <div className="flex flex-col items-center text-gray-300 hover:text-white">
                <div className="mb-2 text-2xl">🍥</div>
                <span className="text-sm">Animes</span>
              </div>
              <div className="flex flex-col items-center text-gray-300 hover:text-white">
                <div className="mb-2 text-2xl">🎓</div>
                <span className="text-sm">Documentários</span>
              </div>
              <div className="flex flex-col items-center text-gray-300 hover:text-white">
                <div className="mb-2 text-2xl">🎮</div>
                <span className="text-sm">Games</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Smartphone size={16} /> <Laptop size={16} /> <Monitor size={16} />
                  <span>Assista onde quiser</span>
                </h4>
                <p className="text-gray-400 text-sm">
                  Assista no celular, tablet, smart TV, notebook ou qualquer outro dispositivo.
                </p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Award size={16} />
                  <span>Qualidade 4K</span>
                </h4>
                <p className="text-gray-400 text-sm">
                  Aproveite imagens nítidas com alta resolução de até 4K (quando disponível).
                </p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Star size={16} />
                  <span>Conteúdo premiado</span>
                </h4>
                <p className="text-gray-400 text-sm">
                  Acesso aos melhores filmes, séries, documentários e muito mais.
                </p>
              </div>
            </div>
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

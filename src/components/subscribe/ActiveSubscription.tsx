import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Check, Package } from "lucide-react";
import { toast } from "sonner";

interface ActiveSubscriptionProps {
  subscriptionTier: string | null;
  hasTrialAccess?: boolean;
  hasTempAccess?: boolean;
  trialEnd?: string | null;
}

const ActiveSubscription = ({ 
  subscriptionTier, 
  hasTrialAccess = false,
  hasTempAccess = false,
  trialEnd = null
}: ActiveSubscriptionProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Format the trial end date
  const formattedTrialEnd = trialEnd ? new Date(trialEnd).toLocaleDateString('pt-BR') : '';
  
  // Determina o tipo de acesso para mostrar a mensagem correta
  const getAccessTypeMessage = () => {
    if (hasTrialAccess) {
      return `Você está utilizando o período de teste gratuito até ${formattedTrialEnd}`;
    } else if (hasTempAccess) {
      return "Você possui acesso temporário";
    } else if (subscriptionTier === "monthly") {
      return "Você está no plano Mensal"; 
    } else if (subscriptionTier === "annual") {
      return "Você está no plano Anual";
    } else {
      return "Você possui uma assinatura ativa";
    }
  };
  
  const handleSubscribe = async (priceId: string) => {
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

      // Check if we're in demo mode
      if (data.demo_mode) {
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

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Erro ao processar assinatura");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-netflix-background">
      <div className="container mx-auto pt-24 px-4 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Você já possui acesso ao conteúdo</h1>
          <p className="text-gray-300 mb-8">
            {getAccessTypeMessage()}
          </p>
          
          {(hasTrialAccess || hasTempAccess) && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-white mb-4">Assine agora e garanta seu acesso contínuo</h2>
              
              <div className="grid md:grid-cols-2 gap-8 mt-6">
                {/* Monthly Plan */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-white transition-transform hover:scale-105">
                  <div className="bg-netflix-red py-3 px-4 rounded-lg mb-4">
                    <h3 className="text-xl font-bold">Plano Mensal</h3>
                    <p className="text-lg">
                      <span className="line-through text-gray-300">R$14,90</span>
                      <span className="ml-2">R$9,90/mês</span>
                    </p>
                    <p className="text-sm mt-1">
                      <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs">33% de desconto</span>
                    </p>
                  </div>
                  
                  <ul className="space-y-2 mb-6 text-left">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
                      <span>Acesso a todos os conteúdos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
                      <span>Cancele quando quiser</span>
                    </li>
                  </ul>
                  
                  <Button 
                    className="w-full py-4 mt-auto text-white bg-netflix-red hover:bg-netflix-red/90"
                    onClick={() => handleSubscribe("price_monthly")}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Processando...
                      </span> : 
                      'Assinar Plano Mensal'
                    }
                  </Button>
                </div>
                
                {/* Annual Plan */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-white transition-transform hover:scale-105 relative">
                  <div className="absolute -right-2 top-4 bg-green-500 text-white px-3 py-1 rounded-l-lg font-medium text-sm">
                    <Package className="inline-block mr-1 h-4 w-4" />
                    Mais popular
                  </div>
                  
                  <div className="bg-netflix-red py-3 px-4 rounded-lg mb-4">
                    <h3 className="text-xl font-bold">Plano Anual</h3>
                    <p className="text-lg">
                      <span className="line-through text-gray-300">R$178,80</span>
                      <span className="ml-2">R$100/ano</span>
                    </p>
                    <p className="text-sm mt-1">
                      <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs">44% de desconto</span>
                    </p>
                  </div>
                  
                  <ul className="space-y-2 mb-6 text-left">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
                      <span>Acesso a todos os conteúdos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
                      <span>Cancele quando quiser</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Economize 44% comparado ao plano mensal</strong></span>
                    </li>
                  </ul>
                  
                  <Button 
                    className="w-full py-4 mt-auto text-white bg-green-600 hover:bg-green-700"
                    onClick={() => handleSubscribe("price_annual")}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Processando...
                      </span> : 
                      'Assinar Plano Anual'
                    }
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
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
};

export default ActiveSubscription;

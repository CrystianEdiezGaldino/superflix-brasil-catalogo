import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Check, Star, Zap, Shield, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Subscribe = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [focusedItem, setFocusedItem] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: "monthly",
      name: "Mensal",
      originalPrice: "R$ 19,90",
      price: "R$ 9,90",
      period: "mês",
      features: [
        "Acesso a todo o catálogo exclusivo",
        "Qualidade de vídeo em HD",
        "Até 3 dispositivos simultâneos",
        "Sem anúncios no aplicativo",
        "Suporte prioritário"
      ],
      popular: false,
      savings: "50% de desconto"
    },
    {
      id: "annual",
      name: "Anual",
      originalPrice: "R$ 178,80",
      price: "R$ 100,00",
      period: "ano",
      features: [
        "Acesso a todo o catálogo exclusivo",
        "Qualidade de vídeo em 4K",
        "Até 6 dispositivos simultâneos",
        "Sem anúncios no aplicativo",
        "Downloads ilimitados",
        "Suporte VIP 24/7",
        "Conteúdos exclusivos",
        "Economia de 44%"
      ],
      popular: true,
      savings: "44% de desconto"
    }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          setFocusedItem(prev => Math.min(prev + 1, plans.length - 1));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedItem(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          handleSubscribe(plans[focusedItem].id);
          break;
        case 'Backspace':
          e.preventDefault();
          window.history.back();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedItem]);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast.error("Você precisa estar logado para assinar um plano");
      navigate("/auth");
      return;
    }

    setIsProcessing(true);
    try {
      const productId = planId === "monthly" ? "prod_SHSb9G94AXb8Nl" : "prod_SHSce9XGUSazQq";
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: productId,
          mode: "subscription"
        }
      });

      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (error) {
      console.error("Erro ao processar assinatura:", error);
      toast.error("Ocorreu um erro ao processar sua assinatura");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Assine Agora e Comece a Assistir
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Escolha o plano perfeito para você e tenha acesso a todo o nosso catálogo exclusivo
            </p>
            
            {/* Value Propositions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="flex flex-col items-center">
                <Star className="h-8 w-8 text-netflix-red mb-2" />
                <p className="text-white">Conteúdo Exclusivo</p>
              </div>
              <div className="flex flex-col items-center">
                <Zap className="h-8 w-8 text-netflix-red mb-2" />
                <p className="text-white">Alta Qualidade</p>
              </div>
              <div className="flex flex-col items-center">
                <Shield className="h-8 w-8 text-netflix-red mb-2" />
                <p className="text-white">Segurança Total</p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="h-8 w-8 text-netflix-red mb-2" />
                <p className="text-white">Múltiplos Usuários</p>
              </div>
            </div>
          </div>
          
          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={plan.id}
                className={`bg-black/60 border-2 backdrop-blur-sm p-6 transition-all duration-200 ${
                  plan.popular 
                    ? 'border-green-500 scale-105' 
                    : 'border-netflix-red/20'
                } ${
                  index === focusedItem ? 'ring-2 ring-netflix-red' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -right-2 top-4 bg-green-500 text-white px-4 py-1 rounded-l-lg font-medium text-sm">
                    Mais Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-gray-400 line-through">{plan.originalPrice}</span>
                    <span className="text-3xl font-bold text-netflix-red">{plan.price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                  <span className="inline-block mt-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                    {plan.savings}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-white flex items-start gap-2">
                      <Check className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing}
                  className={`w-full py-6 text-lg ${
                    plan.popular 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-netflix-red hover:bg-red-700'
                  } text-white`}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Processando...
                    </span>
                  ) : (
                    `Assinar Plano ${plan.name}`
                  )}
                </Button>

                <p className="text-center text-gray-400 text-sm mt-4">
                  <Clock className="inline-block mr-1 h-4 w-4" />
                  7 dias de garantia ou seu dinheiro de volta
                </p>
              </Card>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              Mais de 100.000 usuários já confiam em nós • Suporte 24/7 • Pagamento 100% seguro
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscribe;

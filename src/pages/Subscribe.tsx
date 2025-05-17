import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const Subscribe = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [focusedItem, setFocusedItem] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: "basic",
      name: "Básico",
      price: "R$ 19,90",
      features: [
        "Acesso a todo o catálogo",
        "Qualidade de vídeo padrão",
        "Um dispositivo por vez",
        "Sem anúncios"
      ]
    },
    {
      id: "standard",
      name: "Padrão",
      price: "R$ 29,90",
      features: [
        "Acesso a todo o catálogo",
        "Qualidade de vídeo HD",
        "Dois dispositivos simultâneos",
        "Sem anúncios",
        "Downloads disponíveis"
      ]
    },
    {
      id: "premium",
      name: "Premium",
      price: "R$ 39,90",
      features: [
        "Acesso a todo o catálogo",
        "Qualidade de vídeo 4K + HDR",
        "Quatro dispositivos simultâneos",
        "Sem anúncios",
        "Downloads disponíveis",
        "Áudio espacial"
      ]
    }
  ];

  // Navegação por controle de TV
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
      // Aqui você implementaria a lógica de pagamento
      // Por enquanto, vamos apenas simular um sucesso
      setTimeout(() => {
        navigate("/subscription-success");
      }, 1000);
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
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Escolha seu Plano
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={plan.id}
                className={`bg-black/60 border-netflix-red/20 backdrop-blur-sm p-6 transition-all duration-200 ${
                  index === focusedItem ? 'scale-105 ring-2 ring-netflix-red' : ''
                }`}
              >
                <h2 className="text-2xl font-bold text-white mb-4">{plan.name}</h2>
                <p className="text-3xl font-bold text-netflix-red mb-6">{plan.price}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-white flex items-center">
                      <span className="text-netflix-red mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing}
                  className="w-full bg-netflix-red hover:bg-red-700 text-white"
                >
                  {isProcessing ? "Processando..." : "Assinar Agora"}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscribe;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SubscriptionInfo from "./SubscriptionInfo";
import SubscriptionPlansSection from "./SubscriptionPlansSection";
import SubscriptionActionButtons from "./SubscriptionActionButtons";

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
  
  const handleSubscribe = async (priceId: string) => {
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

      if (error) {
        console.error("Erro na chamada da função create-checkout:", error);
        throw new Error(error.message || "Erro ao processar assinatura");
      }

      console.log("Resposta do create-checkout:", data);

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

      if (!data.url) {
        throw new Error("URL do checkout não foi retornada");
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
    <div className="min-h-screen bg-netflix-background">
      <div className="container mx-auto pt-24 px-4 pb-16">
        <SubscriptionInfo 
          subscriptionTier={subscriptionTier}
          hasTrialAccess={hasTrialAccess}
          hasTempAccess={hasTempAccess}
          trialEnd={trialEnd}
        />
        
        {(hasTrialAccess || hasTempAccess) && (
          <SubscriptionPlansSection 
            handleSubscribe={handleSubscribe}
            isProcessing={isProcessing}
          />
        )}
        
        <SubscriptionActionButtons />
      </div>
    </div>
  );
};

export default ActiveSubscription;

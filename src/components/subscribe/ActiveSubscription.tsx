
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
  const { user, session } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubscribe = async (productId: string) => {
    if (!user) {
      toast.error("Você precisa estar logado para assinar");
      navigate("/auth");
      return;
    }

    if (!session) {
      toast.error("Sessão inválida. Por favor, faça login novamente");
      return;
    }

    setIsProcessing(true);
    try {
      console.log("Iniciando processo de checkout com productId:", productId);
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: productId,
          mode: "subscription"
        },
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      console.log("Resposta do create-checkout:", data);

      if (error) {
        console.error("Erro na chamada da função create-checkout:", error);
        throw new Error(error.message || "Erro ao processar assinatura");
      }

      if (data?.error) {
        console.error("Erro retornado pelo servidor:", data.error);
        throw new Error(data.error);
      }

      if (!data?.url) {
        console.error("URL do checkout não retornada:", data);
        throw new Error("URL do checkout não foi retornada. Verifique se os IDs de produto estão corretos.");
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
        
        {/* Only show subscription plans for temp or trial access, not for active subscribers */}
        {(hasTrialAccess || hasTempAccess) && !subscriptionTier?.match(/monthly|annual/) && (
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

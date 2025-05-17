
import { useState } from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import Navbar from "@/components/Navbar";
import SubscriptionPlans from "@/components/subscribe/SubscriptionPlans";
import ContentCategories from "@/components/subscribe/ContentCategories";
import ActiveSubscription from "@/components/subscribe/ActiveSubscription";
import SubscriptionHeader from "@/components/subscribe/SubscriptionHeader";
import DemoModeNotification from "@/components/subscribe/DemoModeNotification";
import PromoCodeSection from "@/components/subscribe/PromoCodeSection";

const Subscribe = () => {
  const { 
    isSubscribed, 
    isLoading, 
    hasTrialAccess,
    hasTempAccess,
    subscriptionTier,
    trialEnd
  } = useSubscription();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Verifica se o usuário tem qualquer tipo de acesso válido
  const hasValidAccess = isSubscribed || hasTrialAccess || hasTempAccess;
  
  if (isLoading) {
    return (
      <>
        <Navbar onSearch={() => {}} />
        <div className="min-h-screen bg-netflix-background flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg">Verificando assinatura...</p>
          </div>
        </div>
      </>
    );
  }
  
  // Se já possui qualquer tipo de acesso válido, mostra o plano atual
  if (hasValidAccess) {
    return (
      <>
        <Navbar onSearch={() => {}} />
        <ActiveSubscription 
          isSubscribed={isSubscribed}
          hasTrialAccess={hasTrialAccess}
          hasTempAccess={hasTempAccess}
          subscriptionTier={subscriptionTier}
          trialEnd={trialEnd}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={() => {}} />
      <div className="container mx-auto pt-24 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <SubscriptionHeader />
          
          <DemoModeNotification isDemoMode={isDemoMode} />
          
          <SubscriptionPlans 
            isProcessing={isProcessing} 
            setIsProcessing={setIsProcessing} 
            isDemoMode={isDemoMode}
          />
          
          <PromoCodeSection />
          
          <ContentCategories />
          
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

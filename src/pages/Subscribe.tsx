
import { useState, useEffect } from "react";
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
    subscriptionTier, 
    isLoading, 
    hasTrialAccess,
    hasTempAccess,
    trialEnd 
  } = useSubscription();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Store page state in sessionStorage to prevent reloads when switching tabs
  useEffect(() => {
    const storeKey = 'subscribePageState';
    
    // Load previous state if available
    try {
      const savedState = sessionStorage.getItem(storeKey);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setIsProcessing(parsedState.isProcessing || false);
        setIsDemoMode(parsedState.isDemoMode || false);
      }
    } catch (error) {
      console.error("Error loading page state:", error);
    }
    
    // Store state when component unmounts or tab switches
    const saveState = () => {
      try {
        sessionStorage.setItem(storeKey, JSON.stringify({ 
          isProcessing,
          isDemoMode,
          timestamp: new Date().getTime()
        }));
      } catch (error) {
        console.error("Error saving page state:", error);
      }
    };
    
    // Save state when tab visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveState();
      }
    };
    
    window.addEventListener('beforeunload', saveState);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      saveState();
      window.removeEventListener('beforeunload', saveState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isProcessing, isDemoMode]);
  
  // Verifica se o usuário tem qualquer tipo de acesso válido
  const hasValidAccess = isSubscribed || hasTrialAccess || hasTempAccess;
  
  // Se já possui qualquer tipo de acesso válido, mostra o plano atual
  if (hasValidAccess && !isLoading) {
    return (
      <>
        <Navbar onSearch={() => {}} />
        <ActiveSubscription 
          subscriptionTier={subscriptionTier} 
          hasTrialAccess={hasTrialAccess}
          hasTempAccess={hasTempAccess}
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

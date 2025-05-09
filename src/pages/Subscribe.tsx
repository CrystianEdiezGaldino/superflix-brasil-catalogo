
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
  const [pageLoadCount, setPageLoadCount] = useState(0);

  // Prevenir recarregamentos desnecessários ao mudar de abas
  useEffect(() => {
    // Guarda o estado da página na sessionStorage
    const savePageState = () => {
      sessionStorage.setItem('subscribePageState', JSON.stringify({
        isProcessing,
        isDemoMode,
        timestamp: new Date().getTime()
      }));
    };

    // Carrega o estado da página da sessionStorage
    const loadPageState = () => {
      try {
        const savedState = sessionStorage.getItem('subscribePageState');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          setIsDemoMode(parsedState.isDemoMode);
          setIsProcessing(parsedState.isProcessing);
        }
      } catch (error) {
        console.error("Error restoring page state:", error);
      }
    };

    // Só carrega o estado se não for o primeiro carregamento da página
    if (pageLoadCount === 0) {
      loadPageState();
      setPageLoadCount(prevCount => prevCount + 1);
    }

    // Salva o estado sempre que mudar
    savePageState();

    // Evento para quando a página fica visível novamente
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Não recarregamos a página, apenas confirmamos o estado
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isProcessing, isDemoMode, pageLoadCount]);
  
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

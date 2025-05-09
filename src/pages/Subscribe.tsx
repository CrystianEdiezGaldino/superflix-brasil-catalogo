
import { useState } from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import Navbar from "@/components/Navbar";
import SubscriptionPlans from "@/components/subscribe/SubscriptionPlans";
import ContentCategories from "@/components/subscribe/ContentCategories";
import ActiveSubscription from "@/components/subscribe/ActiveSubscription";
import SubscriptionHeader from "@/components/subscribe/SubscriptionHeader";
import DemoModeNotification from "@/components/subscribe/DemoModeNotification";

const Subscribe = () => {
  const { isSubscribed, subscriptionTier, isLoading } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // If already subscribed, show current plan
  if (isSubscribed && !isLoading) {
    return (
      <>
        <Navbar onSearch={() => {}} />
        <ActiveSubscription subscriptionTier={subscriptionTier} />
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

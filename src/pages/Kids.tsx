
import React from "react";
import Navbar from "@/components/Navbar";
import LoadingState from "@/components/home/LoadingState";
import { useAuth } from "@/contexts/AuthContext";
import LargeSubscriptionUpsell from "@/components/home/LargeSubscriptionUpsell";
import { useSubscription } from "@/contexts/SubscriptionContext";

const Kids = () => {
  const { user, loading } = useAuth();
  const { isSubscribed, isAdmin, hasTempAccess, hasTrialAccess } = useSubscription();

  // Check if user has access
  const hasAccess = isSubscribed || isAdmin || hasTempAccess;

  // Redirection handling
  if (loading) {
    return <LoadingState />;
  }

  if (!hasAccess && !hasTrialAccess) {
    return <LargeSubscriptionUpsell />;
  }

  return (
    <div className="bg-gradient-to-b from-blue-900 to-indigo-900 min-h-screen pb-10">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Área Infantil
        </h1>
        
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl text-center">
          <p className="text-white text-lg mb-4">
            Esta seção está temporariamente indisponível.
          </p>
          <p className="text-gray-300">
            Estamos trabalhando para trazer o melhor conteúdo infantil para você e sua família em breve!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Kids;

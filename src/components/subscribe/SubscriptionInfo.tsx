
import React from "react";

interface SubscriptionInfoProps {
  subscriptionTier: string | null;
  hasTrialAccess?: boolean;
  hasTempAccess?: boolean;
  trialEnd?: string | null;
}

const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({ 
  subscriptionTier, 
  hasTrialAccess = false,
  hasTempAccess = false,
  trialEnd = null
}) => {
  // Format the trial end date
  const formattedTrialEnd = trialEnd ? new Date(trialEnd).toLocaleDateString('pt-BR') : '';
  
  // Determines the type of access to show the correct message
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

  return (
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-white mb-6">Você já possui acesso ao conteúdo</h1>
      <p className="text-gray-300 mb-8">
        {getAccessTypeMessage()}
      </p>
    </div>
  );
};

export default SubscriptionInfo;

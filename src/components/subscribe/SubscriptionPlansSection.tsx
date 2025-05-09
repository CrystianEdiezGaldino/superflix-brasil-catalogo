
import React from "react";
import SubscriptionPlanCard from "./SubscriptionPlanCard";

interface SubscriptionPlansSectionProps {
  handleSubscribe: (priceId: string) => Promise<void>;
  isProcessing: boolean;
}

const SubscriptionPlansSection: React.FC<SubscriptionPlansSectionProps> = ({ 
  handleSubscribe, 
  isProcessing 
}) => {
  const monthlyBenefits = [
    "Acesso a todos os conteúdos",
    "Cancele quando quiser"
  ];

  const annualBenefits = [
    "Acesso a todos os conteúdos",
    "Cancele quando quiser",
    "<strong>Economize 44% comparado ao plano mensal</strong>"
  ];
  
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold text-white mb-4 text-center">Assine agora e garanta seu acesso contínuo</h2>
      
      <div className="grid md:grid-cols-2 gap-8 mt-6">
        {/* Monthly Plan */}
        <SubscriptionPlanCard 
          title="Plano Mensal"
          isAnnual={false}
          originalPrice="R$14,90"
          discountedPrice="R$9,90/mês"
          discountPercentage="33%"
          benefits={monthlyBenefits}
          onSubscribe={() => handleSubscribe("price_monthly")}
          isProcessing={isProcessing}
        />
        
        {/* Annual Plan */}
        <SubscriptionPlanCard 
          title="Plano Anual"
          isAnnual={true}
          originalPrice="R$178,80"
          discountedPrice="R$100/ano"
          discountPercentage="44%"
          benefits={annualBenefits}
          onSubscribe={() => handleSubscribe("price_annual")}
          isProcessing={isProcessing}
          isPopular={true}
        />
      </div>
    </div>
  );
};

export default SubscriptionPlansSection;

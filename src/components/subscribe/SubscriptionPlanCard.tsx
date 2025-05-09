
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Package } from "lucide-react";

interface SubscriptionPlanCardProps {
  title: string;
  isAnnual: boolean;
  originalPrice: string;
  discountedPrice: string;
  discountPercentage: string;
  benefits: string[];
  onSubscribe: () => void;
  isProcessing: boolean;
  isPopular?: boolean;
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  title,
  isAnnual,
  originalPrice,
  discountedPrice,
  discountPercentage,
  benefits,
  onSubscribe,
  isProcessing,
  isPopular = false,
}) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-white transition-transform hover:scale-105 relative">
      {isPopular && (
        <div className="absolute -right-2 top-4 bg-green-500 text-white px-3 py-1 rounded-l-lg font-medium text-sm">
          <Package className="inline-block mr-1 h-4 w-4" />
          Mais popular
        </div>
      )}
      
      <div className={`bg-netflix-red py-3 px-4 rounded-lg mb-4`}>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-lg">
          <span className="line-through text-gray-300">{originalPrice}</span>
          <span className="ml-2">{discountedPrice}</span>
        </p>
        <p className="text-sm mt-1">
          <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs">{discountPercentage} de desconto</span>
        </p>
      </div>
      
      <ul className="space-y-2 mb-6 text-left">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className={`h-5 w-5 ${benefit.includes('Economize') ? 'text-green-500' : 'text-netflix-red'} flex-shrink-0 mt-0.5`} />
            <span dangerouslySetInnerHTML={{ __html: benefit }} />
          </li>
        ))}
      </ul>
      
      <Button 
        className={`w-full py-4 mt-auto text-white ${isAnnual ? 'bg-green-600 hover:bg-green-700' : 'bg-netflix-red hover:bg-netflix-red/90'}`}
        onClick={onSubscribe}
        disabled={isProcessing}
      >
        {isProcessing ? 
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Processando...
          </span> : 
          `Assinar Plano ${isAnnual ? 'Anual' : 'Mensal'}`
        }
      </Button>
    </div>
  );
};

export default SubscriptionPlanCard;

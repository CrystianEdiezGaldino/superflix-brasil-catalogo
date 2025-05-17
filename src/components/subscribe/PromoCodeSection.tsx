
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import PromoCodeInput from "./PromoCodeInput";

const PromoCodeSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="mt-8 border-t border-gray-700 pt-4">
      <Button 
        variant="ghost" 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full justify-between items-center text-gray-300 hover:text-white"
      >
        <span>Possui um código promocional?</span>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </Button>
      
      {isExpanded && (
        <div className="mt-4">
          <p className="text-gray-400 text-sm mb-4">
            Se você recebeu um código promocional, insira-o abaixo para resgatar seu período de teste gratuito.
          </p>
          <PromoCodeInput />
        </div>
      )}
    </div>
  );
};

export default PromoCodeSection;

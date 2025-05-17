
import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AdblockSuggestion = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;

  return (
    <div className="mb-6 p-4 bg-amber-900/30 backdrop-blur-sm border border-amber-600/30 rounded-lg relative">
      <button 
        onClick={() => setIsVisible(false)} 
        className="absolute top-2 right-2 text-white/80 hover:text-white"
        aria-label="Fechar"
      >
        <X size={18} />
      </button>
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
        <div className="flex-shrink-0 bg-amber-500/20 p-2 rounded-full">
          <AlertTriangle className="text-amber-400 h-5 w-5" />
        </div>
        
        <div className="flex-grow">
          <h3 className="text-amber-200 font-medium mb-1">Melhore sua experiência</h3>
          <p className="text-sm text-white/80">
            Para uma experiência sem interrupções e livre de anúncios indesejados, recomendamos instalar o AdBlocker Ultimate.
          </p>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a 
                href="https://chromewebstore.google.com/detail/adblocker-ultimate/ohahllgiabjaoigichmmfljhkcfikeof" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-shrink-0 mt-2 md:mt-0"
              >
                <Button 
                  variant="outline" 
                  className="text-amber-200 border-amber-400/50 hover:bg-amber-500/20 hover:text-amber-100"
                >
                  Instalar AdBlocker
                </Button>
              </a>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Elimine anúncios indesejados</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AdblockSuggestion;

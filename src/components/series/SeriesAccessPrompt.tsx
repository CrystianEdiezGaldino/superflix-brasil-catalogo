
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface SeriesAccessPromptProps {
  hasAccess: boolean;
}

const SeriesAccessPrompt = ({ hasAccess }: SeriesAccessPromptProps) => {
  const { isSubscribed, hasTrialAccess, hasTempAccess } = useSubscription();
  
  // Considera todos os tipos de acesso válidos
  const hasValidAccess = hasAccess || isSubscribed || hasTrialAccess || hasTempAccess;
  
  if (hasValidAccess) return null;
  
  return (
    <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-md">
      <p className="text-amber-400 text-sm">
        É necessário ter uma assinatura ativa para assistir a este conteúdo.
        Assine um de nossos planos para ter acesso ilimitado ou resgate um código promocional.
      </p>
      <Link to="/subscribe" className="mt-2 inline-block">
        <Button 
          variant="outline" 
          size="sm"
          className="border-netflix-red text-netflix-red hover:bg-netflix-red/10"
        >
          Ver Planos
        </Button>
      </Link>
    </div>
  );
};

export default SeriesAccessPrompt;

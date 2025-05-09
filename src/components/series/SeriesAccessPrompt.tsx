
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface SeriesAccessPromptProps {
  hasAccess: boolean;
}

const SeriesAccessPrompt = ({ hasAccess }: SeriesAccessPromptProps) => {
  const { isSubscribed, hasTrialAccess, hasTempAccess, isAdmin, isLoading } = useSubscription();
  
  // Consider all valid access types and don't show prompt when loading
  const hasValidAccess = hasAccess || isSubscribed || hasTrialAccess || hasTempAccess || isAdmin;
  
  // Adicionando um log para depuração
  console.log("SeriesAccessPrompt - Access state:", {
    hasAccess,
    isSubscribed,
    hasTrialAccess,
    hasTempAccess,
    isAdmin,
    hasValidAccess,
    isLoading
  });
  
  // Não mostrar nada durante o carregamento ou se tiver acesso válido
  if (isLoading || hasValidAccess) return null;
  
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

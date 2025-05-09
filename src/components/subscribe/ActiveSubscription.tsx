
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ActiveSubscriptionProps {
  subscriptionTier: string | null;
  hasTrialAccess?: boolean;
  hasTempAccess?: boolean;
  trialEnd?: string | null;
}

const ActiveSubscription = ({ 
  subscriptionTier, 
  hasTrialAccess = false,
  hasTempAccess = false,
  trialEnd = null
}: ActiveSubscriptionProps) => {
  const navigate = useNavigate();
  
  // Format the trial end date
  const formattedTrialEnd = trialEnd ? new Date(trialEnd).toLocaleDateString('pt-BR') : '';
  
  // Determina o tipo de acesso para mostrar a mensagem correta
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
    <div className="min-h-screen bg-netflix-background">
      <div className="container mx-auto pt-24 px-4 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Você já possui acesso ao conteúdo</h1>
          <p className="text-gray-300 mb-8">
            {getAccessTypeMessage()}
          </p>
          
          {hasTrialAccess && (
            <div className="mb-8 p-4 bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-2">Assine agora e garanta seu acesso após o período de teste</h2>
              <p className="text-gray-300 mb-4">
                Você pode assinar agora e sua assinatura começará imediatamente. O tempo restante do seu período 
                de teste será adicionado ao seu primeiro ciclo de cobrança!
              </p>
              <Button 
                onClick={() => navigate("/subscribe")} 
                className="bg-netflix-red hover:bg-netflix-red/90"
              >
                Ver planos de assinatura
              </Button>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="default" 
              onClick={() => navigate("/")}
              className="px-8 py-6 text-lg"
            >
              Explorar Conteúdos
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate("/profile")}
              className="px-8 py-6 text-lg"
            >
              Gerenciar Assinatura
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveSubscription;

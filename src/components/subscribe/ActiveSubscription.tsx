
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ActiveSubscriptionProps {
  subscriptionTier: string | null;
  hasTrialAccess?: boolean;
  hasTempAccess?: boolean;
}

const ActiveSubscription = ({ 
  subscriptionTier, 
  hasTrialAccess = false,
  hasTempAccess = false
}: ActiveSubscriptionProps) => {
  const navigate = useNavigate();
  
  // Determina o tipo de acesso para mostrar a mensagem correta
  const getAccessTypeMessage = () => {
    if (hasTrialAccess) {
      return "Você está utilizando o período de teste gratuito";
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


import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ActiveSubscriptionProps {
  subscriptionTier: string | null;
}

const ActiveSubscription = ({ subscriptionTier }: ActiveSubscriptionProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-netflix-background">
      <div className="container mx-auto pt-24 px-4 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Você já possui uma assinatura ativa</h1>
          <p className="text-gray-300 mb-8">
            {subscriptionTier === "monthly" 
              ? "Você está no plano Mensal" 
              : subscriptionTier === "annual" 
                ? "Você está no plano Anual"
                : subscriptionTier === "temp"
                  ? "Você possui acesso temporário"
                  : "Você possui uma assinatura ativa"}
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

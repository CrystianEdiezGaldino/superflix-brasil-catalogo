
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/contexts/SubscriptionContext";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkSubscription } = useSubscription();
  
  // Extract session_id from URL if present
  const sessionId = new URLSearchParams(location.search).get('session_id');

  useEffect(() => {
    // Reload subscription status
    const refreshSubscription = async () => {
      try {
        await checkSubscription();
        toast.success("Assinatura confirmada com sucesso!");
      } catch (error) {
        console.error("Error refreshing subscription:", error);
      }
    };

    refreshSubscription();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={() => {}} />
      <div className="container mx-auto pt-24 px-4 pb-16">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">Assinatura Realizada com Sucesso!</h1>
          
          <p className="text-gray-300 mb-8">
            Obrigado por assinar nosso serviço. Você agora tem acesso completo a todo o conteúdo premium.
            Aproveite sua experiência de streaming!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="default" 
              onClick={() => navigate("/")}
              className="px-6 py-5"
            >
              Explorar Conteúdo
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/profile")}
              className="px-6 py-5"
            >
              Ver Meu Perfil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;

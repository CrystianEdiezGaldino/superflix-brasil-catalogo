
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkSubscription } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(true);
  const [daysAdded, setDaysAdded] = useState<number | null>(null);
  const [newEndDate, setNewEndDate] = useState<string | null>(null);
  const [paymentVerified, setPaymentVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const processSubscription = async () => {
      try {
        // Get the session ID from the URL query parameters
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id');

        if (!sessionId) {
          console.log("No session ID found in URL");
          setPaymentVerified(false);
          setIsProcessing(false);
          return;
        }

        // First check subscription status 
        await checkSubscription();
        
        // Verify the session is valid by checking with Stripe
        try {
          const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-session', {
            body: { sessionId }
          });
          
          if (verifyError || !verifyData?.valid) {
            console.error("Payment verification failed:", verifyError || "Invalid session");
            setPaymentVerified(false);
            setIsProcessing(false);
            return;
          }
          
          setPaymentVerified(true);
          
          // Then check if we need to extend the subscription with trial days
          const { data, error } = await supabase.functions.invoke('extend-subscription', {
            body: { sessionId }
          });
          
          if (error) {
            console.error("Error extending subscription:", error);
          } else if (data && data.success && data.daysAdded) {
            console.log("Subscription extended:", data);
            setDaysAdded(data.daysAdded);
            setNewEndDate(data.newEndDate);
            
            // Update subscription status after extension
            setTimeout(() => {
              checkSubscription();
            }, 2000);
          }
        } catch (error) {
          console.error("Failed to process subscription:", error);
          setPaymentVerified(false);
        }
        
        setIsProcessing(false);
      } catch (error) {
        console.error("Error processing subscription:", error);
        toast.error("Erro ao processar assinatura");
        setPaymentVerified(false);
        setIsProcessing(false);
      }
    };

    processSubscription();
  }, [location.search, checkSubscription]);

  // Redirect to subscribe page if accessed directly without valid payment
  useEffect(() => {
    // If we've completed processing and payment isn't verified, redirect after delay
    if (!isProcessing && paymentVerified === false) {
      const timer = setTimeout(() => {
        toast.error("Processo de pagamento não finalizado ou inválido");
        navigate("/subscribe");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isProcessing, paymentVerified, navigate]);

  return (
    <div className="min-h-screen bg-netflix-background">
      <div className="container mx-auto pt-24 px-4 pb-16">
        <div className="max-w-3xl mx-auto text-center bg-gray-900 rounded-lg p-8 shadow-lg border border-gray-800">
          {isProcessing ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-netflix-red animate-spin mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Processando sua assinatura</h2>
              <p className="text-gray-300">Por favor, aguarde enquanto confirmamos seu pagamento...</p>
            </div>
          ) : paymentVerified ? (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Assinatura confirmada!</h2>
              
              <p className="text-xl text-gray-300 mb-6">
                Sua assinatura foi ativada com sucesso. Aproveite o acesso completo ao conteúdo!
              </p>
              
              {daysAdded && daysAdded > 0 && (
                <div className="bg-gray-800 p-4 rounded-lg mb-6 w-full">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">
                    Período estendido!
                  </h3>
                  <p className="text-gray-300">
                    Adicionamos {daysAdded} dias do seu período de teste à sua assinatura.
                    {newEndDate && (
                      <span> Sua próxima cobrança será em {new Date(newEndDate).toLocaleDateString('pt-BR')}.</span>
                    )}
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button 
                  onClick={() => navigate("/")}
                  className="px-8 py-6 text-lg bg-netflix-red hover:bg-netflix-red/90"
                >
                  Começar a assistir
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => navigate("/profile")}
                  className="px-8 py-6 text-lg"
                >
                  Ver minha assinatura
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Processo de pagamento não finalizado</h2>
              
              <p className="text-xl text-gray-300 mb-6">
                O processo de assinatura não foi concluído. Redirecionando para a página de assinatura...
              </p>
              
              <Button 
                onClick={() => navigate("/subscribe")}
                className="px-8 py-6 text-lg bg-netflix-red hover:bg-netflix-red/90"
              >
                Voltar para assinatura
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubscriptionSuccess;

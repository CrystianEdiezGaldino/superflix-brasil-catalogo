import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Calendar, CreditCard, Gift, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import CancelSubscriptionModal from "./CancelSubscriptionModal";

interface SubscriptionTabProps {
  user: User | null;
  isSubscribed: boolean;
  hasTempAccess: boolean;
  subscriptionTier: string | null;
  subscriptionEnd: string | null;
}

const SubscriptionTab = ({ 
  user, 
  isSubscribed, 
  hasTempAccess,
  subscriptionTier, 
  subscriptionEnd 
}: SubscriptionTabProps) => {
  const navigate = useNavigate();
  const [isCanceling, setIsCanceling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleCancelSubscription = async () => {
    if (!user) return;
    
    setIsCanceling(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal", {
        body: {}
      });

      if (error) throw error;
      
      if (data.demo_mode) {
        toast.error("Sistema de pagamento em modo de demonstração");
        return;
      }
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast.error("Erro ao processar solicitação");
    } finally {
      setIsCanceling(false);
    }
  };

  const handleKeepSubscription = () => {
    setShowCancelModal(false);
    toast.success("Ótimo! Você continuará aproveitando todos os benefícios da sua assinatura!");
  };

  const getPlanName = (tier: string | null) => {
    switch (tier) {
      case "monthly":
        return "Mensal";
      case "annual":
        return "Anual";
      case "premium":
        return "Premium";
      default:
        return "Personalizado";
    }
  };

  return (
    <>
      <div className="grid gap-6">
        {/* Status Card */}
        <Card className="bg-gray-900 text-white border-gray-700 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-netflix-red to-purple-600" />
          <CardContent className="pt-6">
            <div className="space-y-6">
              {isSubscribed ? (
                <>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={20} />
                    <span className="font-semibold text-lg">Assinatura Ativa</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard size={18} className="text-gray-400" />
                        <span className="text-gray-400">Plano</span>
                      </div>
                      <p className="font-semibold">
                        {getPlanName(subscriptionTier)}
                      </p>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={18} className="text-gray-400" />
                        <span className="text-gray-400">Válido até</span>
                      </div>
                      <p className="font-semibold">{formatDate(subscriptionEnd)}</p>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Star className="text-yellow-500" size={18} />
                      Benefícios da Assinatura
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Acesso a todo o catálogo de filmes e séries</li>
                      <li>• Conteúdo atualizado semanalmente</li>
                      <li>• Qualidade de streaming em 4K</li>
                      <li>• Suporte prioritário</li>
                    </ul>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm text-gray-400 mb-3">
                      Sua assinatura será renovada automaticamente na data de vencimento. 
                      Você pode cancelar a qualquer momento.
                    </p>
                    <Button 
                      variant="destructive"
                      onClick={() => setShowCancelModal(true)}
                      disabled={isCanceling}
                      className="w-full sm:w-auto"
                    >
                      {isCanceling ? "Processando..." : "Gerenciar/Cancelar Assinatura"}
                    </Button>
                  </div>
                </>
              ) : hasTempAccess ? (
                <>
                  <div className="flex items-center gap-2 text-yellow-400">
                    <CheckCircle size={20} />
                    <span className="font-semibold text-lg">Acesso Temporário</span>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={18} className="text-gray-400" />
                      <span className="text-gray-400">Válido até</span>
                    </div>
                    <p className="font-semibold">{formatDate(subscriptionEnd)}</p>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm text-gray-400 mb-3">
                      Você tem acesso temporário ao nosso conteúdo. 
                      Para continuar tendo acesso após o período de avaliação, assine um de nossos planos.
                    </p>
                    <Button 
                      onClick={() => navigate("/subscribe")}
                      className="w-full sm:w-auto bg-netflix-red hover:bg-netflix-red/90"
                    >
                      Ver Planos de Assinatura
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-red-400">
                    <XCircle size={20} />
                    <span className="font-semibold text-lg">Sem Assinatura Ativa</span>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Gift className="text-yellow-500" size={18} />
                      Benefícios da Assinatura
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Acesso a todo o catálogo de filmes e séries</li>
                      <li>• Conteúdo atualizado semanalmente</li>
                      <li>• Qualidade de streaming em 4K</li>
                      <li>• Suporte prioritário</li>
                    </ul>
                  </div>
                  
                  <p className="text-gray-300 py-2">
                    Você ainda não possui uma assinatura ativa. 
                    Assine agora para ter acesso completo a todo o conteúdo.
                  </p>
                  
                  <Button 
                    onClick={() => navigate("/subscribe")}
                    className="w-full sm:w-auto bg-netflix-red hover:bg-netflix-red/90"
                  >
                    Ver Planos de Assinatura
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <CancelSubscriptionModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelSubscription}
        onKeepSubscription={handleKeepSubscription}
      />
    </>
  );
};

export default SubscriptionTab;

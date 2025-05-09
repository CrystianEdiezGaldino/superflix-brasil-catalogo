
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface TrialNotificationProps {
  trialEnd: string | null;
}

const TrialNotification = ({ trialEnd }: TrialNotificationProps) => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-800 py-6 px-4 mb-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold text-white">Você está no período de avaliação gratuito!</h3>
          <p className="text-white/90 mb-1">
            Aproveite acesso a todo o conteúdo até {new Date(trialEnd || "").toLocaleDateString('pt-BR')}
          </p>
          <p className="text-white/90 text-sm">
            Assine agora e o tempo restante do seu período de teste será adicionado à sua assinatura!
          </p>
        </div>
        <Link to="/subscribe">
          <Button className="bg-white text-green-700 hover:bg-gray-100">
            Ver Planos
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TrialNotification;

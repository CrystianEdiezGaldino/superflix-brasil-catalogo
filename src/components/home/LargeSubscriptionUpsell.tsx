
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LargeSubscriptionUpsell = () => {
  return (
    <div className="px-4 py-8 mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg mx-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Acesse conteúdo exclusivo!</h2>
        <p className="text-gray-300 mb-6">
          Assine agora e tenha acesso a mais animes, incluindo as coleções completas e recomendações personalizadas.
        </p>
        <Link to="/subscribe">
          <Button size="lg" className="px-8 py-6 text-lg">
            Ver Planos de Assinatura
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LargeSubscriptionUpsell;

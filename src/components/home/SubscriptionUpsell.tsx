
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SubscriptionUpsell = () => {
  return (
    <div className="bg-gradient-to-r from-netflix-red to-red-800 py-6 px-4 mb-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold text-white">Assine para acessar todo o conteúdo!</h3>
          <p className="text-white/90">Planos a partir de R$9,90/mês com 7 dias grátis.</p>
        </div>
        <Link to="/subscribe">
          <Button className="bg-white text-netflix-red hover:bg-gray-100">
            Assinar Agora
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionUpsell;

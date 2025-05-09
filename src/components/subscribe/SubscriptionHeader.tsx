
import { Award, Monitor, Globe, Star } from "lucide-react";

const SubscriptionHeader = () => {
  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl font-bold text-white mb-4">Assine por menos de um café por dia</h1>
      <p className="text-xl text-gray-300 mb-8">Tudo em um só lugar por um preço acessível. <span className="text-netflix-red font-semibold">Cancele quando quiser.</span></p>
      <div className="bg-gradient-to-r from-netflix-red/20 to-purple-700/20 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Por que escolher nossa plataforma?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center">
            <div className="bg-netflix-red rounded-full p-3 mb-3">
              <Award size={24} className="text-white" />
            </div>
            <span className="text-white text-sm">Conteúdo exclusivo</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-netflix-red rounded-full p-3 mb-3">
              <Monitor size={24} className="text-white" />
            </div>
            <span className="text-white text-sm">Qualidade até 4K</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-netflix-red rounded-full p-3 mb-3">
              <Globe size={24} className="text-white" />
            </div>
            <span className="text-white text-sm">Sem restrições</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-netflix-red rounded-full p-3 mb-3">
              <Star size={24} className="text-white" />
            </div>
            <span className="text-white text-sm">Mais barato do mercado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionHeader;

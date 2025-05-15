
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Film, PlayCircle, User } from "lucide-react";

const UnauthenticatedState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-netflix-background bg-gradient-to-b from-black/90 to-black/70 flex flex-col items-center justify-center px-4">
      <div className="max-w-3xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center justify-center p-4 bg-netflix-red rounded-full">
            <Film size={32} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Filmes, séries e muito mais.<br />Sem limites.
        </h1>
        
        <p className="text-xl text-gray-300 mb-8">
          Assista onde quiser. Cancele quando quiser.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            onClick={() => navigate("/auth")} 
            className="bg-netflix-red hover:bg-red-700 text-white px-8 py-6 text-lg flex items-center"
            size="lg"
          >
            <User className="mr-2 h-5 w-5" />
            Fazer Login
          </Button>
          
          <Button 
            onClick={() => navigate("/auth")} 
            variant="outline"
            className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg flex items-center"
            size="lg"
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            Criar Conta
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-2">Assista onde quiser</h3>
            <p className="text-gray-300">Milhares de filmes e séries no seu celular, tablet, computador ou TV.</p>
          </div>
          
          <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-2">Qualidade em HD</h3>
            <p className="text-gray-300">Desfrute da melhor experiência com conteúdo em alta definição.</p>
          </div>
          
          <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-2">Cancele facilmente</h3>
            <p className="text-gray-300">Assine hoje, cancele quando quiser. Sem contratos ou compromissos.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthenticatedState;

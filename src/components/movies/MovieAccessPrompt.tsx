
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MovieAccessPromptProps {
  hasAccess: boolean;
}

const MovieAccessPrompt = ({ hasAccess }: MovieAccessPromptProps) => {
  if (hasAccess) return null;
  
  return (
    <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-md">
      <p className="text-amber-400 text-sm">
        É necessário ter uma assinatura ativa para assistir a este conteúdo.
        Assine um de nossos planos para ter acesso ilimitado.
      </p>
      <Link to="/subscribe" className="mt-2 block">
        <Button 
          variant="outline" 
          className="border-netflix-red text-netflix-red hover:bg-netflix-red/10"
        >
          Ver Planos
        </Button>
      </Link>
    </div>
  );
};

export default MovieAccessPrompt;

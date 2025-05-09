
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MovieLoadingStateProps {
  isLoading: boolean;
  hasUser: boolean;
  hasError: boolean;
}

const MovieLoadingState = ({ isLoading, hasUser, hasError }: MovieLoadingStateProps) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasUser && !isLoading) {
    return (
      <div className="min-h-screen bg-netflix-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white mb-4">Faça login para acessar</h1>
        <Button onClick={() => navigate("/auth")} className="bg-netflix-red hover:bg-red-700">
          Ir para login
        </Button>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-netflix-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white mb-4">Filme não encontrado</h1>
        <Link to="/" className="text-netflix-red hover:underline">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return null;
};

export default MovieLoadingState;

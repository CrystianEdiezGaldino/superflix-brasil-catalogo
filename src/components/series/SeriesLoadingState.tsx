
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

interface SeriesLoadingStateProps {
  isLoading: boolean;
  hasUser: boolean;
  hasError: boolean;
}

const SeriesLoadingState = ({ isLoading, hasUser, hasError }: SeriesLoadingStateProps) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasUser && !isLoading) {
    return (
      <div className="min-h-screen bg-netflix-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white mb-4">Faça login para acessar</h1>
        <Button onClick={() => navigate("/auth")} className="bg-red-600 hover:bg-red-700">
          Ir para login
        </Button>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-netflix-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white mb-4">Série não encontrada</h1>
        <Link to="/" className="text-red-600 hover:underline">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return null;
};

export default SeriesLoadingState;

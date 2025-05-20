
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({ message = "Ocorreu um erro ao carregar o conteúdo.", onRetry }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-netflix-background px-4">
      <AlertTriangle className="h-20 w-20 text-netflix-red mb-6" />
      <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 text-center">Ops! Algo deu errado.</h1>
      <p className="text-gray-300 text-center max-w-md mb-8">{message}</p>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="bg-netflix-red hover:bg-red-700 text-white px-8 py-2"
        >
          Tentar Novamente
        </Button>
      )}
      
      <Button 
        variant="link"
        onClick={() => window.location.reload()}
        className="text-gray-300 mt-4 hover:text-white"
      >
        Recarregar Página
      </Button>
    </div>
  );
};

export default ErrorState;

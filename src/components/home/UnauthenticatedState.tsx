
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const UnauthenticatedState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-netflix-background flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-white mb-4">Faça login para acessar</h1>
      <Button onClick={() => navigate("/auth")} className="bg-netflix-red hover:bg-red-700">
        Ir para login
      </Button>
    </div>
  );
};

export default UnauthenticatedState;

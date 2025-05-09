
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SubscriptionActionButtons: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
      <Button 
        variant="default" 
        onClick={() => navigate("/")}
        className="px-8 py-6 text-lg"
      >
        Explorar Conteúdos
      </Button>
      
      <Button 
        variant="outline" 
        onClick={() => navigate("/profile")}
        className="px-8 py-6 text-lg"
      >
        Gerenciar Assinatura
      </Button>
    </div>
  );
};

export default SubscriptionActionButtons;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { CheckCircle } from "lucide-react";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [focusedButton, setFocusedButton] = useState(0);

  // Navegação por controle de TV
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          setFocusedButton(prev => Math.min(prev + 1, 1));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedButton(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedButton === 0) {
            navigate("/");
          } else {
            navigate("/profile");
          }
          break;
        case 'Backspace':
          e.preventDefault();
          window.history.back();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedButton, navigate]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-black/60 border-netflix-red/20 backdrop-blur-sm p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-netflix-red" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              Assinatura Confirmada!
            </h1>
            
            <p className="text-gray-300 mb-8">
              Obrigado por se juntar à nossa plataforma. Sua assinatura foi ativada com sucesso.
              Agora você tem acesso a todo o nosso catálogo de conteúdo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/")}
                className={`bg-netflix-red hover:bg-red-700 text-white transition-all duration-200 ${
                  focusedButton === 0 ? 'scale-105 ring-2 ring-netflix-red' : ''
                }`}
              >
                Ir para a Página Inicial
              </Button>
              
              <Button
                onClick={() => navigate("/profile")}
                className={`bg-gray-800 hover:bg-gray-700 text-white transition-all duration-200 ${
                  focusedButton === 1 ? 'scale-105 ring-2 ring-netflix-red' : ''
                }`}
              >
                Ver Meu Perfil
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SubscriptionSuccess;

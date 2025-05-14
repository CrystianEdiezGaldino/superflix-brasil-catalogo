
import React from 'react';
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import TvChannelsList from '@/components/tv/TvChannelsList';
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TvChannels = () => {
  const { user } = useAuth();
  const { hasAccess } = useSubscription();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-netflix-background">
        <Navbar onSearch={() => {}} />
        <div className="container mx-auto px-4 pt-24 pb-16 text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Canais de TV ao Vivo</h1>
          <div className="bg-black/50 p-8 rounded-xl max-w-lg mx-auto backdrop-blur-md">
            <h2 className="text-xl font-medium text-white mb-4">Faça login para acessar</h2>
            <p className="text-gray-300 mb-6">
              É necessário estar logado para assistir aos canais de TV ao vivo.
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              size="lg" 
              className="bg-netflix-red hover:bg-red-700"
            >
              Fazer Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-netflix-background">
        <Navbar onSearch={() => {}} />
        <div className="container mx-auto px-4 pt-24 pb-16 text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Canais de TV ao Vivo</h1>
          <div className="bg-black/50 p-8 rounded-xl max-w-lg mx-auto backdrop-blur-md">
            <h2 className="text-xl font-medium text-white mb-4">Conteúdo Exclusivo para Assinantes</h2>
            <p className="text-gray-300 mb-6">
              Assine um de nossos planos para ter acesso aos canais de TV ao vivo.
            </p>
            <Button 
              onClick={() => navigate('/subscribe')}
              size="lg" 
              className="bg-netflix-red hover:bg-red-700"
            >
              Assinar Agora
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <Helmet>
        <title>Canais de TV ao Vivo | StreamFlix</title>
        <meta name="description" content="Assista a canais de TV ao vivo no StreamFlix" />
      </Helmet>
      
      <Navbar onSearch={() => {}} />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-white mb-6">Canais de TV ao Vivo</h1>
        <TvChannelsList />
      </div>
    </div>
  );
};

export default TvChannels;

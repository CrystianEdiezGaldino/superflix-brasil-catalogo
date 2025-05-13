
import React from 'react';
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet";
import TvChannelsList from '@/components/tv/TvChannelsList';
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TvChannels = () => {
  const { user } = useAuth();
  const { isSubscribed } = useSubscription();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-netflix-background">
        <Navbar onSearch={() => {}} />
        <div className="pt-24 flex flex-col items-center justify-center px-4 text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Canais de TV ao Vivo</h1>
          <p className="mb-6">Faça login para acessar os canais de TV ao vivo.</p>
          <Button 
            onClick={() => navigate("/auth")}
            className="bg-netflix-red hover:bg-netflix-red/80 text-white"
          >
            Entrar
          </Button>
        </div>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="min-h-screen bg-netflix-background">
        <Navbar onSearch={() => {}} />
        <div className="pt-24 flex flex-col items-center justify-center px-4 text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Conteúdo Premium</h1>
          <p className="mb-6">Os canais de TV ao vivo estão disponíveis apenas para assinantes.</p>
          <Button 
            onClick={() => navigate("/subscribe")}
            className="bg-netflix-red hover:bg-netflix-red/80 text-white"
          >
            Assinar Agora
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <Helmet>
        <title>Canais de TV Ao Vivo - SuperFlix</title>
      </Helmet>
      <Navbar onSearch={() => {}} />
      <div className="container pt-24 pb-10 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Canais de TV Ao Vivo</h1>
        <TvChannelsList />
      </div>
    </div>
  );
};

export default TvChannels;

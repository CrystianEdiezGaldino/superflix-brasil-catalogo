import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { tvChannels, TVChannel } from '@/data/tvChannels';
import TvChannelCard from '@/components/tv/TvChannelCard';
import TvChannelModal from '@/components/tv/TvChannelModal';

const TvChannels = () => {
  const { user } = useAuth();
  const { isSubscribed } = useSubscription();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<TVChannel | null>(null);

  const filteredChannels = tvChannels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Canais de TV Ao Vivo</h1>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Procurar canal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-black/50 border-gray-700 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredChannels.map((channel) => (
            <TvChannelCard
              key={channel.id}
              channel={channel}
              onSelect={setSelectedChannel}
            />
          ))}
        </div>
      </div>

      <TvChannelModal
        channel={selectedChannel}
        isOpen={!!selectedChannel}
        onClose={() => setSelectedChannel(null)}
      />
    </div>
  );
};

export default TvChannels;

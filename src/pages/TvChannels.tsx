
import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { TvChannel } from '@/types/tvChannel';
import TvChannelCard from '@/components/tv/TvChannelCard';
import TvChannelModal from '@/components/tv/TvChannelModal';

// TV Channels data with categories and embedUrl
const tvChannels: TvChannel[] = [
  // Canais de TV aberta
  {
    id: "globo-rj",
    name: "Globo RJ",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Logotipo_da_TV_Globo.png/640px-Logotipo_da_TV_Globo.png",
    embedUrl: "https://embedtv-0.icu/embed/globo-rj",
    category: "TV Aberta"
  },
  {
    id: "globo-sp",
    name: "Globo SP",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Logotipo_da_TV_Globo.png/640px-Logotipo_da_TV_Globo.png",
    embedUrl: "https://embedtv-0.icu/embed/globo-sp",
    category: "TV Aberta"
  },
  {
    id: "band",
    name: "Band",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Rede_Bandeirantes_logo_2011.svg/500px-Rede_Bandeirantes_logo_2011.svg.png",
    embedUrl: "https://embedtv-0.icu/embed/band",
    category: "TV Aberta"
  },
  {
    id: "record",
    name: "Record",
    logo: "https://upload.wikimedia.org/wikipedia/pt/1/10/Logotipo_da_Record.png",
    embedUrl: "https://embedtv-0.icu/embed/record",
    category: "TV Aberta"
  },
  {
    id: "sbt",
    name: "SBT",
    logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/4/41/Logotipo_do_SBT.svg/1200px-Logotipo_do_SBT.svg.png",
    embedUrl: "https://embedtv-0.icu/embed/sbt-central",
    category: "TV Aberta"
  },
  {
    id: "cultura",
    name: "Cultura",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Cultura_logo_2013.svg/800px-Cultura_logo_2013.svg.png",
    embedUrl: "https://embedtv-0.icu/embed/cultura",
    category: "TV Aberta"
  },
  
  // Canais de Notícias
  {
    id: "globo-news",
    name: "Globo News",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Logotipo_da_GloboNews.png/800px-Logotipo_da_GloboNews.png",
    embedUrl: "https://embedtv-0.icu/embed/globo-news",
    category: "Notícias"
  },
  {
    id: "cnn-brasil",
    name: "CNN Brasil",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/CNN_Brasil.svg/512px-CNN_Brasil.svg.png",
    embedUrl: "https://embedtv-0.icu/embed/cnn-brasil",
    category: "Notícias"
  },
  {
    id: "band-news",
    name: "Band News",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7f/BandNews_logo_2010.png",
    embedUrl: "https://embedtv-0.icu/embed/band-news",
    category: "Notícias"
  },
  
  // Canais de Esportes
  {
    id: "sportv",
    name: "SporTV",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Logo_SporTV.png/800px-Logo_SporTV.png",
    embedUrl: "https://embedtv-0.icu/embed/sportv",
    category: "Esportes"
  },
  {
    id: "sportv2",
    name: "SporTV 2",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/SporTV_2_logo_2016.svg/500px-SporTV_2_logo_2016.svg.png",
    embedUrl: "https://embedtv-0.icu/embed/sportv-2",
    category: "Esportes"
  },
  {
    id: "sportv3",
    name: "SporTV 3",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/SporTV3_2021.png/800px-SporTV3_2021.png",
    embedUrl: "https://embedtv-0.icu/embed/sportv-3",
    category: "Esportes"
  },
  {
    id: "espn",
    name: "ESPN",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ESPN_wordmark.svg/800px-ESPN_wordmark.svg.png",
    embedUrl: "https://embedtv-0.icu/embed/espn",
    category: "Esportes"
  },
  {
    id: "espn2",
    name: "ESPN 2",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/ESPN2_logo.svg/800px-ESPN2_logo.svg.png",
    embedUrl: "https://embedtv-0.icu/embed/espn-2",
    category: "Esportes"
  },
  {
    id: "premiere1",
    name: "Premiere 1",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Premiere_FC_2018.svg/800px-Premiere_FC_2018.svg.png",
    embedUrl: "https://embedtv-0.icu/embed/premiere-1",
    category: "Esportes"
  },
  {
    id: "combate",
    name: "Combate",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Combate_logo_2021.svg/800px-Combate_logo_2021.svg.png",
    embedUrl: "https://embedtv-0.icu/embed/combate",
    category: "Esportes"
  },
  
  // Canais de Filmes e Séries
  {
    id: "hbo",
    name: "HBO",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HBO_logo.svg/800px-HBO_logo.svg.png",
    embedUrl: "https://embedtv-0.icu/embed/hbo",
    category: "Filmes e Séries"
  },
  {
    id: "hbo2",
    name: "HBO 2",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/HBO_2_Logo_Poland.svg/2560px-HBO_2_Logo_Poland.svg.png",
    embedUrl: "https://embedtv-0.icu/embed/hbo-2",
    category: "Filmes e Séries"
  },
  {
    id: "tnt",
    name: "TNT",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/TNT_Logo_2016.svg/800px-TNT_Logo_2016.svg.png",
    embedUrl: "https://embedtv-0.icu/embed/tnt",
    category: "Filmes e Séries"
  },
  {
    id: "space",
    name: "Space",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/SpaceLogo.svg/800px-SpaceLogo.svg.png",
    embedUrl: "https://embedtv-0.icu/embed/space",
    category: "Filmes e Séries"
  },
  {
    id: "warner",
    name: "Warner Channel",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Warner2018LA.png/800px-Warner2018LA.png",
    embedUrl: "https://embedtv-0.icu/embed/warnerchannel",
    category: "Filmes e Séries"
  },
  {
    id: "universal",
    name: "Universal",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Universal_TV_logo.svg/800px-Universal_TV_logo.svg.png", 
    embedUrl: "https://embedtv-0.icu/embed/universal",
    category: "Filmes e Séries"
  },
  
  // Canais Infantis
  {
    id: "cartoon",
    name: "Cartoon Network",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Cartoon_Network_2010_logo.svg/800px-Cartoon_Network_2010_logo.svg.png",
    embedUrl: "https://embedtv-0.icu/embed/cartoon-network",
    category: "Infantil"
  },
  {
    id: "nick",
    name: "Nickelodeon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Nickelodeon_2009_logo.svg/800px-Nickelodeon_2009_logo.svg.png",
    embedUrl: "https://embedtv-0.icu/embed/nickelodeon",
    category: "Infantil"
  },
  {
    id: "disney",
    name: "Disney Channel",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Disney_Channel_2014_HD.png/800px-Disney_Channel_2014_HD.png",
    embedUrl: "https://embedtv-0.icu/embed/disney-plus-1",
    category: "Infantil"
  },
  {
    id: "gloob",
    name: "Gloob",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Gloob_logo.svg/800px-Gloob_logo.svg.png",
    embedUrl: "https://embedtv-0.icu/embed/gloob", 
    category: "Infantil"
  },
  
  // Variedades
  {
    id: "multishow",
    name: "Multishow",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Multishow.png/591px-Multishow.png",
    embedUrl: "https://embedtv-0.icu/embed/multishow",
    category: "Variedades"
  },
  {
    id: "viva",
    name: "VIVA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Viva_2018_wordmark.svg/800px-Viva_2018_wordmark.svg.png",
    embedUrl: "https://embedtv-0.icu/embed/viva",
    category: "Variedades"
  },
  {
    id: "gnt",
    name: "GNT",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/GNT_logo-roxo.svg/800px-GNT_logo-roxo.svg.png",
    embedUrl: "https://embedtv-0.icu/embed/gnt",
    category: "Variedades"
  },
  {
    id: "comedy",
    name: "Comedy Central",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Comedy_Central_2018.svg/800px-Comedy_Central_2018.svg.png",
    embedUrl: "https://embedtv-0.icu/embed/comedy-central",
    category: "Variedades"
  }
];

const TvChannels = () => {
  const { user } = useAuth();
  const { isSubscribed } = useSubscription();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<TvChannel | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  // Extrair categorias únicas para o filtro
  const categories = ['Todos', ...Array.from(new Set(tvChannels.map(channel => channel.category)))];

  // Filtrar canais por categoria e pesquisa
  const filteredChannels = tvChannels.filter(channel => 
    (activeCategory === 'Todos' || channel.category === activeCategory) &&
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Canais de TV Ao Vivo</h1>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Procurar canal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-black/50 border-gray-700 text-white"
            />
          </div>
        </div>
        
        {/* Categorias */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={
                  activeCategory === category 
                    ? "bg-netflix-red hover:bg-netflix-red/80 text-white"
                    : "bg-transparent text-gray-300 border-gray-600 hover:bg-gray-800"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {filteredChannels.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Nenhum canal encontrado com esses critérios.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredChannels.map((channel) => (
              <TvChannelCard
                key={channel.id}
                channel={channel}
                onSelect={setSelectedChannel}
              />
            ))}
          </div>
        )}
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


import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { tvChannels, channelCategories } from "@/data/tvChannels";
import { TvChannel } from "@/data/tvChannels";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";
import ChannelCategory from "@/components/tv/ChannelCategory";
import TvChannelModal from "@/components/tv/TvChannelModal";
import { Tv, TvIcon } from "lucide-react";

const TvChannels = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isSubscribed, isAdmin, isLoading: subscriptionLoading } = useSubscription();
  
  // Initialize state from sessionStorage if available
  const [selectedChannel, setSelectedChannel] = useState<TvChannel | null>(() => {
    const savedChannel = sessionStorage.getItem('selectedChannel');
    return savedChannel ? JSON.parse(savedChannel) : null;
  });
  
  const [isModalOpen, setIsModalOpen] = useState(() => {
    return sessionStorage.getItem('isModalOpen') === 'true';
  });
  
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return sessionStorage.getItem('selectedCategory') || "Todas";
  });

  // Save state to sessionStorage when it changes
  useEffect(() => {
    if (selectedChannel) {
      sessionStorage.setItem('selectedChannel', JSON.stringify(selectedChannel));
    } else {
      sessionStorage.removeItem('selectedChannel');
    }
  }, [selectedChannel]);

  useEffect(() => {
    sessionStorage.setItem('isModalOpen', isModalOpen.toString());
  }, [isModalOpen]);

  useEffect(() => {
    sessionStorage.setItem('selectedCategory', selectedCategory);
  }, [selectedCategory]);

  // Use React Query to manage channels data with proper caching
  const { data: channels = tvChannels, isLoading } = useQuery({
    queryKey: ["tv-channels"],
    queryFn: () => Promise.resolve(tvChannels),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Memoize modal options to prevent unnecessary re-renders
  const modalOptions = useMemo(() => ({
    preventClose: true,
    closeOnOutsideClick: false,
    closeOnEsc: false
  }), []);

  // Group channels by category
  const channelsByCategory = useMemo(() => {
    const grouped: Record<string, TvChannel[]> = {};
    
    if (selectedCategory === "Todas") {
      channelCategories.forEach(category => {
        grouped[category] = channels.filter(channel => channel.category === category);
      });
    } else {
      grouped[selectedCategory] = channels.filter(channel => channel.category === selectedCategory);
    }
    
    return grouped;
  }, [channels, selectedCategory]);
  
  useEffect(() => {
    // Only redirect if we're not loading and definitely have no user
    if (!authLoading && user === null) {
      toast.error("Você precisa estar logado para acessar esta página");
      navigate("/auth");
      return;
    }
  }, [user, authLoading, navigate]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleOpenChannel = useCallback((channel: TvChannel) => {
    setSelectedChannel(channel);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const hasAccess = isSubscribed || isAdmin;

  // Show loading state while checking auth/subscription status
  if (authLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando canais...</p>
        </div>
      </div>
    );
  }
  
  // Don't render content until we have user data
  if (!user) {
    return null; // This prevents flickering before redirect happens
  }

  return (
    <div className="min-h-screen bg-netflix-background text-white">
      <Navbar />
      
      <div className="container mx-auto pt-24 pb-12 px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <TvIcon className="text-netflix-red" size={28} />
              <span>TV ao Vivo</span>
            </h1>
            <p className="text-gray-400">
              Assista aos principais canais de televisão em tempo real
            </p>
          </div>
          
          {!hasAccess && (
            <Button 
              onClick={() => navigate('/subscribe')} 
              className="bg-netflix-red hover:bg-red-700 transition-colors w-full md:w-auto"
            >
              Assinar para ter acesso
            </Button>
          )}
        </div>
        
        {!hasAccess && (
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-lg p-5 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-netflix-red/20 p-3 rounded-full">
                <Tv size={32} className="text-netflix-red" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium mb-2">Conteúdo Exclusivo para Assinantes</h3>
                <p className="text-gray-300 mb-4">
                  Assine agora e tenha acesso a todos os canais de TV ao vivo, filmes, séries e muito mais.
                </p>
                <Button 
                  onClick={() => navigate('/subscribe')} 
                  className="bg-netflix-red hover:bg-red-700"
                >
                  Ver planos
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Category filter */}
        <div className="mb-8 sticky top-[72px] z-10 bg-netflix-background py-3 -mx-4 px-4">
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex space-x-3 pb-1 min-w-max">
              <Button
                variant={selectedCategory === "Todas" ? "default" : "outline"}
                className={`rounded-full transition-colors ${selectedCategory === "Todas" 
                  ? "bg-netflix-red hover:bg-red-700" 
                  : "border-gray-700 bg-gray-800/30 hover:bg-gray-800 text-gray-300"}`}
                onClick={() => handleCategoryChange("Todas")}
              >
                Todas
              </Button>
              {channelCategories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`rounded-full transition-colors ${selectedCategory === category 
                    ? "bg-netflix-red hover:bg-red-700" 
                    : "border-gray-700 bg-gray-800/30 hover:bg-gray-800 text-gray-300"}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mt-3 opacity-50" />
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-md h-40 animate-pulse" />
            ))}
          </div>
        ) : Object.keys(channelsByCategory).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(channelsByCategory).map(([category, categoryChannels]) => (
              <ChannelCategory
                key={category}
                title={category}
                channels={categoryChannels}
                onSelectChannel={handleOpenChannel}
                selectedChannel={selectedChannel}
                hasAccess={hasAccess}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum canal encontrado
            </h3>
            <p className="text-gray-400">
              Não encontramos canais na categoria selecionada.
            </p>
          </div>
        )}
        
        {selectedChannel && (
          <TvChannelModal
            key={`modal-${selectedChannel.id}-${isModalOpen}`}
            channel={selectedChannel}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            hasAccess={hasAccess}
            options={modalOptions}
          />
        )}
      </div>
    </div>
  );
};

export default TvChannels;

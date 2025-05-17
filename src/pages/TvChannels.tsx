import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { tvChannels, channelCategories } from "@/data/tvChannels";
import { TvChannel } from "@/data/tvChannels";
import TvChannelsList from "@/components/tv/TvChannelsList";
import TvChannelModal from "@/components/tv/TvChannelModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";
import React from "react";

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

  // Restore modal state when component mounts
  useEffect(() => {
    const savedChannel = sessionStorage.getItem('selectedChannel');
    const savedModalState = sessionStorage.getItem('isModalOpen');
    
    if (savedChannel && savedModalState === 'true') {
      setSelectedChannel(JSON.parse(savedChannel));
      setIsModalOpen(true);
    }
  }, []);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden, maintain state
        sessionStorage.setItem('wasModalOpen', isModalOpen.toString());
      } else {
        // Tab is visible again, restore state
        const wasModalOpen = sessionStorage.getItem('wasModalOpen') === 'true';
        if (wasModalOpen && selectedChannel) {
          setIsModalOpen(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isModalOpen, selectedChannel]);

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

  // Memoize filtered channels to prevent unnecessary recalculations
  const filteredChannels = useMemo(() => 
    selectedCategory === "Todas" 
      ? channels 
      : channels.filter(channel => channel.category === selectedCategory),
    [channels, selectedCategory]
  );
  
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
    // Não limpar o canal selecionado aqui para manter o estado
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
      <Navbar onSearch={() => {}} />
      
      <div className="container mx-auto pt-24 pb-10 px-4">
        <h1 className="text-3xl font-bold mb-4">TV Ao Vivo</h1>
        <p className="text-gray-400 mb-6">Assista aos principais canais de televisão em tempo real</p>
        
        {!hasAccess && (
          <div className="bg-amber-900/20 border border-amber-800/30 p-4 rounded-lg mb-6">
            <h3 className="text-amber-400 text-lg font-medium mb-2">Conteúdo Exclusivo para Assinantes</h3>
            <p className="text-amber-200/80 mb-4">Assine agora para acessar todos os canais de TV ao vivo.</p>
            <Button 
              onClick={() => navigate('/subscribe')} 
              className="bg-amber-600 hover:bg-amber-700"
            >
              Ver planos
            </Button>
          </div>
        )}
        
        {/* Category filter */}
        <div className="mb-8 overflow-x-auto hide-scrollbar">
          <div className="flex space-x-2 pb-2">
            <Button
              variant={selectedCategory === "Todas" ? "default" : "outline"}
              className={selectedCategory === "Todas" ? "bg-netflix-red" : "border-gray-700 hover:bg-gray-800"}
              onClick={() => handleCategoryChange("Todas")}
            >
              Todas
            </Button>
            {channelCategories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category ? "bg-netflix-red" : "border-gray-700 hover:bg-gray-800"}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <TvChannelsList
          channels={filteredChannels}
          selectedChannel={selectedChannel}
          onSelectChannel={handleOpenChannel}
          isLoading={isLoading}
          hasAccess={hasAccess}
          selectedCategory={selectedCategory}
        />
        
        {selectedChannel && (
          <TvChannelModal
            key={`modal-${selectedChannel.id}`}
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

export default React.memo(TvChannels);

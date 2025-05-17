import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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

const STORAGE_KEY = 'tv_modal_state';

const TvChannels = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isSubscribed, isAdmin, isLoading: subscriptionLoading } = useSubscription();
  
  // Initialize state from localStorage if available
  const [selectedChannel, setSelectedChannel] = useState<TvChannel | null>(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const { channel } = JSON.parse(savedState);
        return channel;
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
    return null;
  });
  
  const [isModalOpen, setIsModalOpen] = useState(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const { isOpen } = JSON.parse(savedState);
        return isOpen;
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
    return false;
  });
  
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return localStorage.getItem('selectedCategory') || "Todas";
  });

  // Save state to localStorage when it changes
  useEffect(() => {
    try {
      const stateToSave = {
        channel: selectedChannel,
        isOpen: isModalOpen
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }, [selectedChannel, isModalOpen]);

  useEffect(() => {
    localStorage.setItem('selectedCategory', selectedCategory);
  }, [selectedCategory]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden, maintain state
        try {
          const currentState = localStorage.getItem(STORAGE_KEY);
          if (currentState) {
            const { channel, isOpen } = JSON.parse(currentState);
            if (isOpen && channel) {
              localStorage.setItem(STORAGE_KEY, JSON.stringify({
                channel,
                isOpen: true,
                wasOpen: true
              }));
            }
          }
        } catch (error) {
          console.error('Error saving visibility state:', error);
        }
      } else {
        // Tab is visible again, restore state
        try {
          const savedState = localStorage.getItem(STORAGE_KEY);
          if (savedState) {
            const { channel, wasOpen } = JSON.parse(savedState);
            if (wasOpen && channel) {
              setSelectedChannel(channel);
              setIsModalOpen(true);
            }
          }
        } catch (error) {
          console.error('Error restoring visibility state:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Memoize modal options to prevent unnecessary re-renders
  const modalOptions = useMemo(() => ({
    preventClose: true,
    closeOnOutsideClick: false,
    closeOnEsc: false
  }), []);

  // Memoize filtered channels to prevent unnecessary recalculations
  const filteredChannels = useMemo(() => 
    selectedCategory === "Todas" 
      ? tvChannels 
      : tvChannels.filter(channel => channel.category === selectedCategory),
    [selectedCategory]
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
          isLoading={false}
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

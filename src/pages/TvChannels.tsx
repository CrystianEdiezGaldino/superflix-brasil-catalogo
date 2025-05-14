
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { tvChannels, channelCategories } from "@/data/tvChannels";
import { TvChannel } from "@/types/tvChannel";
import TvChannelsList from "@/components/tv/TvChannelsList";
import TvChannelModal from "@/components/tv/TvChannelModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";

const TvChannels = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isSubscribed, isAdmin, isLoading: subscriptionLoading } = useSubscription();
  
  const [selectedChannel, setSelectedChannel] = useState<TvChannel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  
  useEffect(() => {
    // Only redirect if we're not loading and definitely have no user
    if (!authLoading && user === null) {
      toast.error("Você precisa estar logado para acessar esta página");
      navigate("/auth");
      return;
    }

    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, authLoading, navigate]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredChannels = selectedCategory === "Todas" 
    ? tvChannels 
    : tvChannels.filter(channel => channel.category === selectedCategory);

  const handleOpenChannel = (channel: TvChannel) => {
    setSelectedChannel(channel);
    setIsModalOpen(true);
  };

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
          onSelectChannel={(channel) => handleOpenChannel(channel)}
          isLoading={isLoading}
          hasAccess={hasAccess}
          selectedCategory={selectedCategory}
        />
        
        {selectedChannel && (
          <TvChannelModal
            channel={selectedChannel}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            hasAccess={hasAccess}
          />
        )}
      </div>
    </div>
  );
};

export default TvChannels;

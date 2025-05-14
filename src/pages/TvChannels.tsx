
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { TvChannel } from '@/types/tvChannel';
import { tvChannels } from '@/data/tvChannels';
import TvChannelsList from '@/components/tv/TvChannelsList';
import SubscriptionUpsell from '@/components/home/SubscriptionUpsell';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TvChannels = () => {
  const [selectedChannel, setSelectedChannel] = useState<TvChannel | null>(null);
  const { isSubscribed, isAdmin, hasTempAccess, hasTrialAccess } = useSubscription();
  
  // Combine subscription statuses
  const hasAccess = isSubscribed || isAdmin || hasTempAccess || hasTrialAccess;

  const { data: channels, isLoading } = useQuery({
    queryKey: ['tv-channels'],
    queryFn: () => tvChannels,
    staleTime: Infinity,
  });

  // Group channels by category
  const categories = channels ? [...new Set(channels.map(channel => channel.category))] : [];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar onSearch={() => {}} />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-white mb-8">Canais de TV ao Vivo</h1>
        
        {!hasAccess ? (
          <SubscriptionUpsell />
        ) : (
          <>
            <Tabs defaultValue={categories[0] || 'all'} className="w-full">
              <TabsList className="mb-8 bg-gray-800 p-1 overflow-x-auto flex flex-nowrap">
                <TabsTrigger value="all" className="text-sm md:text-base">
                  Todos
                </TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="text-sm md:text-base whitespace-nowrap"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all">
                <TvChannelsList 
                  channels={channels || []} 
                  selectedChannel={selectedChannel}
                  onSelectChannel={setSelectedChannel}
                  isLoading={isLoading}
                />
              </TabsContent>
              
              {categories.map((category) => (
                <TabsContent key={category} value={category}>
                  <TvChannelsList 
                    channels={(channels || []).filter(channel => channel.category === category)}
                    selectedChannel={selectedChannel}
                    onSelectChannel={setSelectedChannel}
                    isLoading={isLoading}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default TvChannels;

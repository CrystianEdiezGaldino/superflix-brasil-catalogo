
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ChannelCategory from './ChannelCategory';
import { channelCategories } from '@/data/tvChannels';

const TvChannelsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Filter channels based on search query
  const filterChannels = (category: any) => {
    if (!searchQuery) return category.channels;
    
    return category.channels.filter((channel: any) =>
      channel.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar canais..."
          className="pl-9 bg-black/20 border-gray-700 text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="bg-black/20 border border-gray-800">
            <TabsTrigger value="all">Todos</TabsTrigger>
            {channelCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="all" className="pt-4">
          <div className="space-y-8">
            {channelCategories.map(category => {
              const filteredChannels = filterChannels(category);
              if (filteredChannels.length === 0) return null;
              
              return (
                <ChannelCategory 
                  key={category.id}
                  categoryName={category.name}
                  channels={filteredChannels}
                />
              );
            })}
          </div>
        </TabsContent>

        {channelCategories.map(category => (
          <TabsContent key={category.id} value={category.id} className="pt-4">
            <ChannelCategory 
              categoryName={category.name}
              channels={filterChannels(category)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TvChannelsList;

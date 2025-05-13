import React from 'react';
import { TVChannel } from '@/data/tvChannels';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';

interface TvChannelCardProps {
  channel: TVChannel;
  onSelect: (channel: TVChannel) => void;
}

const TvChannelCard = ({ channel, onSelect }: TvChannelCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isChannelFavorite = isFavorite(channel.id, 'tv');

  return (
    <div 
      className="relative group cursor-pointer bg-netflix-background rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
      onClick={() => onSelect(channel)}
    >
      <div className="aspect-video bg-black/50 flex items-center justify-center">
        <h3 className="text-white text-lg font-semibold">{channel.name}</h3>
      </div>
      
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-netflix-red"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(channel.id, 'tv');
          }}
        >
          <Heart className={`h-6 w-6 ${isChannelFavorite ? 'fill-netflix-red text-netflix-red' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default TvChannelCard; 
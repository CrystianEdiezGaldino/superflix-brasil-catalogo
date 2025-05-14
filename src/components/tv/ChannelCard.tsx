
import React from 'react';
import { TvChannel } from '@/types/tvChannel';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Play, Tv } from 'lucide-react';

interface ChannelCardProps {
  channel: TvChannel;
  onSelect: (channel: TvChannel) => void;
}

const ChannelCard = ({ channel, onSelect }: ChannelCardProps) => {
  return (
    <Card 
      className="group overflow-hidden bg-gray-800/50 border-gray-700 hover:border-netflix-red transition-all cursor-pointer"
      onClick={() => onSelect(channel)}
    >
      <div className="relative">
        <AspectRatio ratio={16/9} className="bg-gray-900 flex items-center justify-center">
          {channel.logo ? (
            <img 
              src={channel.logo} 
              alt={channel.name} 
              className="object-contain h-16 w-full p-2"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4">
              <Tv size={32} className="text-gray-400 mb-2" />
              <span className="text-sm font-medium text-center text-white">{channel.name}</span>
            </div>
          )}
        </AspectRatio>
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <div className="rounded-full bg-netflix-red p-3">
            <Play size={22} fill="white" className="text-white ml-1" />
          </div>
        </div>
      </div>
      <div className="p-2 text-center">
        <h3 className="font-medium text-sm text-white truncate">{channel.name}</h3>
        <p className="text-xs text-gray-400">{channel.category}</p>
      </div>
    </Card>
  );
};

export default ChannelCard;

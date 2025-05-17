
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
          {channel.logoUrl ? (
            <img 
              src={channel.logoUrl} 
              alt={channel.name} 
              className="object-contain h-16 w-full p-2"
              onError={(e) => {
                // Fallback se a imagem não carregar
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.classList.add('fallback-bg');
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'flex flex-col items-center justify-center h-full';
                  fallback.innerHTML = `
                    <svg class="text-gray-400 mb-2" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                      <polyline points="17 2 12 7 7 2"></polyline>
                    </svg>
                    <span class="text-sm font-medium text-center text-white">${channel.name}</span>
                  `;
                  parent.appendChild(fallback);
                }
              }}
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
      <div className="p-3 text-center">
        <h3 className="font-medium text-base text-white truncate">{channel.name}</h3>
        <p className="text-xs text-gray-400">{channel.category}</p>
      </div>
    </Card>
  );
};

export default ChannelCard;

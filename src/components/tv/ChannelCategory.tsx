
import React from 'react';
import ChannelCard from './ChannelCard';
import { TvChannel } from '@/types/tvChannel';

interface ChannelCategoryProps {
  title: string;
  channels: TvChannel[];
  onSelectChannel: (channel: TvChannel) => void;
  selectedChannel: TvChannel | null;
  hasAccess: boolean;
}

const ChannelCategory = ({ 
  title, 
  channels,
  onSelectChannel,
  selectedChannel,
  hasAccess 
}: ChannelCategoryProps) => {
  if (channels.length === 0) return null;
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
        <span className="h-5 w-1.5 bg-netflix-red rounded"></span>
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {channels.map(channel => (
          <ChannelCard 
            key={channel.id} 
            channel={channel}
            onSelect={hasAccess ? onSelectChannel : () => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default ChannelCategory;

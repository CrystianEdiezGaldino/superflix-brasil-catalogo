
import React from 'react';
import ChannelCard from './ChannelCard';
import { TvChannel } from '@/types/tvChannel';

interface ChannelCategoryProps {
  categoryName: string;
  channels: TvChannel[];
}

const ChannelCategory = ({ categoryName, channels }: ChannelCategoryProps) => {
  if (channels.length === 0) return null;
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">{categoryName}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {channels.map(channel => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
};

export default ChannelCategory;

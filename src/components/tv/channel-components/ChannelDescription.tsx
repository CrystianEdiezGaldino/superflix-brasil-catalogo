
import React from 'react';
import { TvChannel } from "@/types/tvChannel";

interface ChannelDescriptionProps {
  channel: TvChannel;
}

const ChannelDescription = ({ channel }: ChannelDescriptionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Sobre o Canal</h3>
      <p className="text-gray-300">{channel.description}</p>
      
      <div className="pt-2">
        <div className="inline-block bg-gray-800/50 text-xs font-medium text-white px-2.5 py-1 rounded">
          {channel.category}
        </div>
      </div>
    </div>
  );
};

export default ChannelDescription;

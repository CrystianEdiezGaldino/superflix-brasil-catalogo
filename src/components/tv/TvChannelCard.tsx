import React from 'react';
import { TvChannel } from '@/data/tvChannels';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface TvChannelCardProps {
  channel: TvChannel;
  onSelect: (channel: TvChannel) => void;
  hasAccess: boolean;
}

const TvChannelCard = ({ channel, onSelect, hasAccess }: TvChannelCardProps) => {
  return (
    <Card className="bg-netflix-card hover:bg-netflix-card-hover transition-colors duration-200 cursor-pointer">
      <CardHeader className="p-4">
        <h3 className="text-lg font-semibold text-white truncate">{channel.name}</h3>
        <p className="text-sm text-gray-400">{channel.category}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-300 line-clamp-2">{channel.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onSelect(channel)}
          className="w-full bg-netflix-red hover:bg-netflix-red-hover"
          disabled={!hasAccess}
        >
          <Play className="w-4 h-4 mr-2" />
          Assistir
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TvChannelCard;

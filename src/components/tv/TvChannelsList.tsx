import { TvChannel } from "@/data/tvChannels";
import TvChannelCard from "./TvChannelCard";

interface TvChannelsListProps {
  channels: TvChannel[];
  selectedChannel: TvChannel | null;
  onSelectChannel: (channel: TvChannel) => void;
  isLoading: boolean;
  hasAccess: boolean;
  selectedCategory: string;
}

const TvChannelsList = ({
  channels,
  selectedChannel,
  onSelectChannel,
  isLoading,
  hasAccess,
  selectedCategory,
}: TvChannelsListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-netflix-card animate-pulse rounded-lg h-48"
          />
        ))}
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-white mb-2">
          Nenhum canal encontrado
        </h3>
        <p className="text-gray-400">
          Não encontramos canais na categoria {selectedCategory}.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {channels.map((channel) => (
        <TvChannelCard
          key={channel.id}
          channel={channel}
          onSelect={onSelectChannel}
          hasAccess={hasAccess}
        />
      ))}
    </div>
  );
};

export default TvChannelsList;


import { TvChannel } from "@/data/tvChannels";
import ChannelCard from "./ChannelCard";

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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-800/50 animate-pulse rounded-lg h-48"
          />
        ))}
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800/20 rounded-lg border border-gray-700/30">
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {channels.map((channel) => (
        <ChannelCard
          key={channel.id}
          channel={channel}
          onSelect={onSelectChannel}
        />
      ))}
    </div>
  );
};

export default TvChannelsList;

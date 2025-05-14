
import { TvChannel } from "@/types/tvChannel";
import ChannelCard from "./ChannelCard";
import ChannelCategory from "./ChannelCategory";
import { channelCategories } from "@/data/tvChannels";

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
  selectedCategory
}: TvChannelsListProps) => {
  // If we're filtering by a specific category, just show those channels in a grid
  if (selectedCategory !== "Todas") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading ? (
          Array(10).fill(0).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-800 h-32 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-800 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-800 rounded w-1/2"></div>
            </div>
          ))
        ) : (
          channels.map(channel => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onSelect={() => onSelectChannel(channel)}
            />
          ))
        )}
      </div>
    );
  }

  // For "All" category, organize by category sections
  return (
    <div className="space-y-10">
      {isLoading ? (
        Array(3).fill(0).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-6 bg-gray-800 rounded w-48 mb-4"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array(5).fill(0).map((_, idx) => (
                <div key={idx}>
                  <div className="bg-gray-800 h-32 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        channelCategories.map(category => {
          const categoryChannels = channels.filter(
            channel => channel.category === category
          );
          
          if (categoryChannels.length === 0) return null;
          
          return (
            <ChannelCategory
              key={category}
              title={category}
              channels={categoryChannels}
              onSelectChannel={onSelectChannel}
              selectedChannel={selectedChannel}
              hasAccess={hasAccess}
            />
          );
        })
      )}
    </div>
  );
};

export default TvChannelsList;

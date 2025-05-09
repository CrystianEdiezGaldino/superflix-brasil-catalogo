
import { Episode } from "@/types/movie";

interface EpisodeCardProps {
  episode: Episode;
  isSelected: boolean;
  onSelect: (episodeNumber: number) => void;
}

const EpisodeCard = ({ episode, isSelected, onSelect }: EpisodeCardProps) => {
  return (
    <div 
      className={`p-4 rounded-md cursor-pointer ${
        isSelected 
          ? "bg-gray-800 border border-netflix-red" 
          : "bg-gray-900 hover:bg-gray-800"
      }`}
      onClick={() => onSelect(episode.episode_number)}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">
            {episode.episode_number}. {episode.name}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mt-1">
            {episode.overview || "Nenhuma sinopse disponível."}
          </p>
        </div>
        
        {episode.still_path && (
          <img 
            src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
            alt={episode.name}
            className="w-32 h-18 object-cover rounded"
          />
        )}
      </div>
    </div>
  );
};

export default EpisodeCard;

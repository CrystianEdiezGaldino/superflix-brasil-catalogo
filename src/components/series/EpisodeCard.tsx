
import { Episode } from "@/types/movie";
import { Play } from "lucide-react";

interface EpisodeCardProps {
  episode: Episode;
  isSelected: boolean;
  onSelect: (episodeNumber: number) => void;
}

const EpisodeCard = ({ episode, isSelected, onSelect }: EpisodeCardProps) => {
  return (
    <div 
      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected 
          ? "bg-netflix-red/20 border border-netflix-red" 
          : "bg-gray-800/50 hover:bg-gray-800 border border-transparent hover:border-gray-700"
      }`}
      onClick={() => onSelect(episode.episode_number)}
    >
      <div className="flex items-start space-x-4">
        {episode.still_path ? (
          <div className="relative w-32 h-20 flex-shrink-0">
            <img 
              src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
              alt={episode.name}
              className="w-full h-full object-cover rounded-md"
            />
            <div className={`absolute inset-0 flex items-center justify-center ${isSelected ? 'bg-netflix-red/40' : 'bg-black/40 hover:bg-black/20'} transition-all rounded-md`}>
              <Play className="w-8 h-8 text-white" fill={isSelected ? "white" : "transparent"} />
            </div>
          </div>
        ) : (
          <div className="w-32 h-20 flex-shrink-0 bg-gray-800 rounded-md flex items-center justify-center">
            <Play className="w-8 h-8 text-white" />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold ${isSelected ? 'text-netflix-red' : 'text-white'}`}>
              {episode.episode_number}. {episode.name}
            </h3>
            {isSelected && (
              <span className="text-xs px-2 py-0.5 bg-netflix-red text-white rounded-full">Selecionado</span>
            )}
          </div>
          
          <p className="text-gray-400 text-sm line-clamp-2 mt-1">
            {episode.overview || "Nenhuma sinopse disponível."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EpisodeCard;

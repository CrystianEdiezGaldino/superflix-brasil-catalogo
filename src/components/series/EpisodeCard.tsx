
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
      className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected 
          ? "bg-netflix-red/20 border border-netflix-red" 
          : "bg-gray-800/50 hover:bg-gray-800 border border-transparent hover:border-gray-700"
      }`}
      onClick={() => onSelect(episode.episode_number)}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        {/* Thumbnail com efeito de hover */}
        <div className="relative w-full sm:w-32 aspect-video sm:h-20 flex-shrink-0 overflow-hidden rounded-md">
          {episode.still_path ? (
            <img 
              src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
              alt={episode.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <Play className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className={`absolute inset-0 flex items-center justify-center ${isSelected ? 'bg-black/50' : 'bg-black/40 hover:bg-black/20'} transition-all`}>
            <div className={`w-10 h-10 rounded-full ${isSelected ? 'bg-netflix-red' : 'bg-black/70'} flex items-center justify-center transition-all`}>
              <Play className="w-5 h-5 text-white" fill="white" />
            </div>
          </div>
        </div>
        
        {/* Informações do episódio */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className={`font-semibold ${isSelected ? 'text-netflix-red' : 'text-white'} text-sm sm:text-base`}>
              {episode.episode_number}. {episode.name}
            </h3>
            {isSelected && (
              <span className="text-xs px-2 py-0.5 bg-netflix-red text-white rounded-full shrink-0 ml-2">
                Selecionado
              </span>
            )}
          </div>
          
          <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 mt-1">
            {episode.overview || "Nenhuma sinopse disponível."}
          </p>
          
          {/* Duração ou data (se disponível) */}
          {episode.air_date && (
            <div className="mt-2 text-xs text-gray-500">
              {new Date(episode.air_date).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpisodeCard;

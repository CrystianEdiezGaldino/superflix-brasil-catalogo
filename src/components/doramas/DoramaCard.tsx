
import { Link } from "react-router-dom";
import { Series, Movie, MediaItem } from "@/types/movie";
import { Card } from "@/components/ui/card";
import DoramaVideoPreview from "./DoramaVideoPreview";

interface DoramaCardProps {
  dorama: MediaItem;
  videoKey?: string;
}

const DoramaCard = ({ dorama, videoKey }: DoramaCardProps) => {
  const isDorama = dorama.media_type === "tv";
  const linkPath = isDorama ? `/dorama/${dorama.id}` : `/filme/${dorama.id}`;
  
  // Obter título (nome para séries, título para filmes)
  const title = isDorama 
    ? (dorama as Series).name 
    : (dorama as Movie).title;
  
  const rating = dorama.vote_average ? Math.round(dorama.vote_average * 10) / 10 : null;
  
  // Não renderizar o card se não tiver imagem (poster ou backdrop)
  if (!dorama.poster_path && !dorama.backdrop_path) {
    return null;
  }
  
  // Para séries (doramas), verificar se é realmente coreano
  if (isDorama && (dorama as Series).original_language !== "ko") {
    return null;
  }
  
  return (
    <Card className="bg-transparent border-none overflow-hidden group">
      <Link 
        to={linkPath}
        className="block overflow-hidden rounded-lg transition-transform duration-300 relative"
      >
        <div className="relative aspect-[2/3] bg-gray-900 overflow-hidden">
          {isDorama ? (
            <DoramaVideoPreview dorama={dorama as Series} videoId={videoKey} />
          ) : (
            <img 
              src={dorama.poster_path ? `https://image.tmdb.org/t/p/w500${dorama.poster_path}` : '/placeholder.svg'}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            {!isDorama && (
              <span className="text-xs font-medium px-1.5 py-0.5 bg-netflix-red text-white rounded">
                Filme
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-2 text-sm text-white truncate">{title}</div>
      </Link>
    </Card>
  );
};

export default DoramaCard;

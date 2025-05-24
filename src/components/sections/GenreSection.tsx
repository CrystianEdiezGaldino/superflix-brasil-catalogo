
import React from 'react';
import { MediaItem } from '@/types/movie';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface GenreSectionProps {
  title: string;
  medias: MediaItem[];
  onMediaClick: (media: MediaItem) => void;
}

const GenreSection: React.FC<GenreSectionProps> = ({ title, medias, onMediaClick }) => {
  if (!medias || medias.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex space-x-4 pb-4">
          {medias.map((item) => (
            <div 
              key={item.id}
              className="w-72 flex-none relative group cursor-pointer"
              onClick={() => onMediaClick(item)}
            >
              <div className="relative overflow-hidden rounded-md">
                <img 
                  src={`https://image.tmdb.org/t/p/w780${item.backdrop_path || item.poster_path}`}
                  alt={item.title || item.name || ''}
                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
                
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white text-sm font-medium">
                    {item.title || item.name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.genre_ids?.slice(0, 2).map((genreId) => (
                      <GenreBadge key={genreId} genreId={genreId} />
                    ))}
                    
                    {item.vote_average && (
                      <Badge variant="outline" className="bg-yellow-900/30 text-yellow-300 text-xs border-yellow-700">
                        ★ {item.vote_average.toFixed(1)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

// Helper component to display genre badges
const GenreBadge: React.FC<{ genreId: number }> = ({ genreId }) => {
  // Map of genre IDs to genre names
  const genreMap: Record<number, string> = {
    28: "Ação",
    12: "Aventura",
    16: "Animação",
    35: "Comédia",
    80: "Crime",
    99: "Documentário",
    18: "Drama",
    10751: "Família",
    14: "Fantasia",
    36: "História",
    27: "Terror",
    10402: "Música",
    9648: "Mistério",
    10749: "Romance",
    878: "Ficção científica",
    10770: "Cinema TV",
    53: "Thriller",
    10752: "Guerra",
    37: "Faroeste"
  };

  return (
    <Badge variant="outline" className="bg-gray-800/60 text-gray-200 text-xs border-gray-700">
      {genreMap[genreId] || `Gênero ${genreId}`}
    </Badge>
  );
};

export default GenreSection;

import React, { useState, useEffect } from 'react';
import { MediaItem } from '@/types/movie';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MediaCard from '@/components/MediaCard';
import { fetchTrilogies, fetchStarWarsMovies, fetchHarryPotterMovies, fetchLordOfTheRingsMovies } from '@/services/tmdb/trilogies';
import { fetchDCMovies } from '@/services/tmdb/dc';

interface CollectionsSectionProps {
  trilogies: MediaItem[];
  batmanMovies: MediaItem[];
  supermanMovies: MediaItem[];
  onMediaClick: (media: MediaItem) => void;
}

const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  trilogies,
  batmanMovies,
  supermanMovies,
  onMediaClick
}) => {
  const [activeTab, setActiveTab] = useState('trilogies');
  const [starWarsMovies, setStarWarsMovies] = useState<MediaItem[]>([]);
  const [harryPotterMovies, setHarryPotterMovies] = useState<MediaItem[]>([]);
  const [lotrMovies, setLotrMovies] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Função para filtrar itens sem imagem
  const filterItemsWithPoster = (items: MediaItem[]) => {
    return items.filter(item => item.poster_path);
  };

  useEffect(() => {
    const loadAllCollections = async () => {
      setIsLoading(true);
      try {
        const [starWars, harryPotter, lotr] = await Promise.all([
          fetchStarWarsMovies(),
          fetchHarryPotterMovies(),
          fetchLordOfTheRingsMovies()
        ]);
        
        // Filtrar itens sem poster antes de atualizar o estado
        setStarWarsMovies(filterItemsWithPoster(starWars));
        setHarryPotterMovies(filterItemsWithPoster(harryPotter));
        setLotrMovies(filterItemsWithPoster(lotr));
      } catch (error) {
        console.error('Error loading collections:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllCollections();
  }, []);

  const renderCollection = (movies: MediaItem[], title: string) => {
    // Filtrar itens sem poster antes de renderizar
    const filteredMovies = filterItemsWithPoster(movies);
    
    // Não renderizar a coleção se não houver itens com poster
    if (filteredMovies.length === 0) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMovies.map((movie, index) => (
            <MediaCard
              key={movie.id}
              media={movie}
              onClick={() => onMediaClick(movie)}
              className="w-full"
              index={index}
              isFocused={focusedIndex === index}
              onFocus={() => setFocusedIndex(index)}
            />
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-800/50 rounded w-1/4"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800/50 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Coleções</h2>
      
      <div className="space-y-8">
        {renderCollection(trilogies, 'Trilogias icônicas')}
        {renderCollection(starWarsMovies, 'Star Wars')}
        {renderCollection(harryPotterMovies, 'Harry Potter')}
        {renderCollection(lotrMovies, 'Senhor dos Anéis')}
        {renderCollection(batmanMovies, 'Batman Collection')}
        {renderCollection(supermanMovies, 'Superman Collection')}
      </div>
    </div>
  );
};

export default CollectionsSection;

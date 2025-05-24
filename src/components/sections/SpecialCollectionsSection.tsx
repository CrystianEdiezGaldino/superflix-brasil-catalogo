
import React, { useEffect, useState, useRef } from 'react';
import { MediaItem } from '@/types/movie';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchTrilogies } from '@/services/tmdb/trilogies';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpecialCollectionsSectionProps {
  marvelMovies: MediaItem[];
  dcMovies: MediaItem[];
  harryPotterMovies: MediaItem[];
  starWarsMovies: MediaItem[];
  lordOfTheRingsMovies: MediaItem[];
  onMediaClick: (media: MediaItem) => void;
}

const SpecialCollectionsSection: React.FC<SpecialCollectionsSectionProps> = ({ 
  marvelMovies,
  dcMovies,
  harryPotterMovies,
  starWarsMovies,
  lordOfTheRingsMovies,
  onMediaClick
}) => {
  // State for managing carousels
  const [activeTab, setActiveTab] = useState("marvel");
  const [loadedMovies, setLoadedMovies] = useState({
    marvel: marvelMovies || [],
    dc: dcMovies || [],
    harryPotter: harryPotterMovies || [],
    starWars: starWarsMovies || [],
    lotr: lordOfTheRingsMovies || []
  });

  // Refs for scroll containers
  const scrollContainers = {
    marvel: useRef<HTMLDivElement>(null),
    dc: useRef<HTMLDivElement>(null),
    harryPotter: useRef<HTMLDivElement>(null),
    starWars: useRef<HTMLDivElement>(null),
    lotr: useRef<HTMLDivElement>(null),
  };

  // Fetch additional content for franchises if needed
  useEffect(() => {
    const fetchMissingContent = async () => {
      try {
        // Only fetch if we don't have content
        if (!harryPotterMovies?.length) {
          const harryPotterData = await fetchTrilogies(20);
          const hpMovies = harryPotterData.filter(movie => 
            movie.title?.toLowerCase().includes('harry potter') || 
            movie.overview?.toLowerCase().includes('harry potter')
          );
          if (hpMovies.length) {
            setLoadedMovies(prev => ({ ...prev, harryPotter: hpMovies }));
          }
        }

        if (!starWarsMovies?.length) {
          const starWarsData = await fetchTrilogies(20);
          const swMovies = starWarsData.filter(movie => 
            movie.title?.toLowerCase().includes('star wars') || 
            movie.overview?.toLowerCase().includes('star wars')
          );
          if (swMovies.length) {
            setLoadedMovies(prev => ({ ...prev, starWars: swMovies }));
          }
        }

        if (!lordOfTheRingsMovies?.length) {
          const lotrData = await fetchTrilogies(20);
          const lotrMovies = lotrData.filter(movie => 
            movie.title?.toLowerCase().includes('lord of the rings') || 
            movie.title?.toLowerCase().includes('hobbit') ||
            movie.overview?.toLowerCase().includes('middle earth') ||
            movie.overview?.toLowerCase().includes('lord of the rings')
          );
          if (lotrMovies.length) {
            setLoadedMovies(prev => ({ ...prev, lotr: lotrMovies }));
          }
        }
      } catch (error) {
        console.error("Error loading franchise movies:", error);
      }
    };

    fetchMissingContent();
  }, [harryPotterMovies, starWarsMovies, lordOfTheRingsMovies]);

  // Handle scrolling for each carousel
  const handleScroll = (direction: 'left' | 'right', tabKey: string) => {
    const container = scrollContainers[tabKey as keyof typeof scrollContainers]?.current;
    if (!container) return;
    
    const scrollAmount = container.clientWidth * 0.75; // Scroll 75% of the visible area
    const scrollTo = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    });
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Universos Cinematográficos</h2>
      
      <Tabs defaultValue="marvel" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4 bg-gray-800/50">
          <TabsTrigger value="marvel">Marvel</TabsTrigger>
          <TabsTrigger value="dc">DC Comics</TabsTrigger>
          <TabsTrigger value="harry-potter">Harry Potter</TabsTrigger>
          <TabsTrigger value="star-wars">Star Wars</TabsTrigger>
          <TabsTrigger value="lotr">Senhor dos Anéis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="marvel">
          <FranchiseCarousel 
            title="Universo Marvel" 
            description="Explore o Universo Cinematográfico Marvel com seus super-heróis e histórias interconectadas." 
            movies={loadedMovies.marvel} 
            onMediaClick={onMediaClick}
            scrollRef={scrollContainers.marvel}
            onScroll={(direction) => handleScroll(direction, 'marvel')}
          />
        </TabsContent>
        
        <TabsContent value="dc">
          <FranchiseCarousel 
            title="Universo DC" 
            description="Mergulhe no universo dos super-heróis da DC Comics." 
            movies={loadedMovies.dc} 
            onMediaClick={onMediaClick}
            scrollRef={scrollContainers.dc}
            onScroll={(direction) => handleScroll(direction, 'dc')}
          />
        </TabsContent>
        
        <TabsContent value="harry-potter">
          <FranchiseCarousel 
            title="Especial Harry Potter" 
            description="O mundo mágico de Harry Potter em uma coleção completa." 
            movies={loadedMovies.harryPotter} 
            onMediaClick={onMediaClick}
            scrollRef={scrollContainers.harryPotter}
            onScroll={(direction) => handleScroll(direction, 'harryPotter')}
          />
        </TabsContent>
        
        <TabsContent value="star-wars">
          <FranchiseCarousel 
            title="Especial Star Wars" 
            description="Uma galáxia muito, muito distante com todos os filmes e séries de Star Wars." 
            movies={loadedMovies.starWars} 
            onMediaClick={onMediaClick}
            scrollRef={scrollContainers.starWars}
            onScroll={(direction) => handleScroll(direction, 'starWars')}
          />
        </TabsContent>
        
        <TabsContent value="lotr">
          <FranchiseCarousel 
            title="Especial Senhor dos Anéis" 
            description="A jornada completa pela Terra Média com todos os filmes de Senhor dos Anéis e O Hobbit." 
            movies={loadedMovies.lotr} 
            onMediaClick={onMediaClick}
            scrollRef={scrollContainers.lotr}
            onScroll={(direction) => handleScroll(direction, 'lotr')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface FranchiseCarouselProps {
  title: string;
  description: string;
  movies: MediaItem[];
  onMediaClick: (media: MediaItem) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  onScroll: (direction: 'left' | 'right') => void;
}

const FranchiseCarousel: React.FC<FranchiseCarouselProps> = ({ 
  title, 
  description, 
  movies, 
  onMediaClick,
  scrollRef,
  onScroll
}) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const checkScrollPosition = () => {
      if (!container) return;
      
      setShowLeftArrow(container.scrollLeft > 20);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 20
      );
    };

    container.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);
    checkScrollPosition();

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [scrollRef, movies]);

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm text-gray-400 mb-3">{description}</p>
      
      <div className="relative group">
        {/* Left navigation button */}
        <button 
          onClick={() => onScroll('left')}
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 rounded-full p-2 transform -translate-x-1/4 transition-opacity",
            showLeftArrow ? "opacity-80" : "opacity-0 pointer-events-none"
          )}
          aria-label="Rolar para a esquerda"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        
        <div 
          ref={scrollRef} 
          className="flex space-x-4 overflow-x-scroll scrollbar-hide pb-4 pt-1 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies && movies.length > 0 ? (
            movies.map((item, index) => (
              <FranchiseItem key={`${item.id}-${index}`} item={item} onMediaClick={onMediaClick} />
            ))
          ) : (
            // Loading placeholders when no movies are available
            Array(6).fill(0).map((_, index) => (
              <div 
                key={`placeholder-${index}`}
                className="w-48 h-64 bg-gray-800/40 rounded-md animate-pulse flex-none"
              />
            ))
          )}
        </div>
        
        {/* Right navigation button */}
        <button 
          onClick={() => onScroll('right')} 
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 rounded-full p-2 transform translate-x-1/4 transition-opacity",
            showRightArrow ? "opacity-80" : "opacity-0 pointer-events-none"
          )}
          aria-label="Rolar para a direita"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  );
};

interface FranchiseItemProps {
  item: MediaItem;
  onMediaClick: (media: MediaItem) => void;
}

const FranchiseItem: React.FC<FranchiseItemProps> = ({ item, onMediaClick }) => {
  return (
    <div 
      className="w-48 flex-none relative group cursor-pointer"
      onClick={() => onMediaClick(item)}
    >
      <div className="relative overflow-hidden rounded-md">
        <img 
          src={`https://image.tmdb.org/t/p/w500${item.poster_path || item.backdrop_path}`}
          alt={item.title || item.name || ''}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
          <div className="p-3">
            <h3 className="text-white text-sm font-medium">{item.title || item.name}</h3>
            {item.release_date && (
              <div className="flex items-center mt-1">
                <span className="text-gray-300 text-xs">
                  {new Date(item.release_date).getFullYear()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialCollectionsSection;

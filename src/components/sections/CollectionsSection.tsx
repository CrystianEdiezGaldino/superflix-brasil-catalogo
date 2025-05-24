
import React, { useState, useEffect } from 'react';
import { MediaItem } from '@/types/movie';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchStarWarsMovies, fetchHarryPotterMovies, fetchLordOfTheRingsMovies } from "@/services/tmdb/trilogies";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from '@/lib/utils';

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
  const [starWarsMovies, setStarWarsMovies] = useState<MediaItem[]>([]);
  const [harryPotterMovies, setHarryPotterMovies] = useState<MediaItem[]>([]);
  const [lordOfTheRingsMovies, setLordOfTheRingsMovies] = useState<MediaItem[]>([]);
  const [activeTab, setActiveTab] = useState("trilogies");
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs for scroll containers
  const containerRefs = {
    trilogies: React.useRef<HTMLDivElement>(null),
    batman: React.useRef<HTMLDivElement>(null),
    superman: React.useRef<HTMLDivElement>(null),
    starWars: React.useRef<HTMLDivElement>(null),
    harryPotter: React.useRef<HTMLDivElement>(null),
    lotr: React.useRef<HTMLDivElement>(null),
  };
  
  // Scroll state for each container
  const [showLeftArrows, setShowLeftArrows] = useState({
    trilogies: false,
    batman: false,
    superman: false,
    starWars: false,
    harryPotter: false,
    lotr: false,
  });
  
  const [showRightArrows, setShowRightArrows] = useState({
    trilogies: true,
    batman: true,
    superman: true,
    starWars: true,
    harryPotter: true,
    lotr: true,
  });

  // Fetch specific franchise data
  useEffect(() => {
    const loadFranchiseData = async () => {
      setIsLoading(true);
      try {
        const [starWars, harryPotter, lotr] = await Promise.all([
          fetchStarWarsMovies(30),
          fetchHarryPotterMovies(30),
          fetchLordOfTheRingsMovies(30)
        ]);
        
        setStarWarsMovies(starWars);
        setHarryPotterMovies(harryPotter);
        setLordOfTheRingsMovies(lotr);
      } catch (error) {
        console.error('Error fetching collection data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFranchiseData();
  }, []);
  
  // Check scroll position for arrows
  useEffect(() => {
    const checkScrollPosition = (key: keyof typeof containerRefs) => {
      const container = containerRefs[key].current;
      if (!container) return;
      
      const hasLeftScroll = container.scrollLeft > 20;
      const hasRightScroll = container.scrollLeft < (container.scrollWidth - container.clientWidth - 20);
      
      setShowLeftArrows(prev => ({ ...prev, [key]: hasLeftScroll }));
      setShowRightArrows(prev => ({ ...prev, [key]: hasRightScroll }));
    };
    
    // Add scroll event listeners
    Object.keys(containerRefs).forEach(key => {
      const container = containerRefs[key as keyof typeof containerRefs].current;
      if (container) {
        container.addEventListener('scroll', () => checkScrollPosition(key as keyof typeof containerRefs));
        // Initial check
        checkScrollPosition(key as keyof typeof containerRefs);
      }
    });
    
    // Cleanup
    return () => {
      Object.keys(containerRefs).forEach(key => {
        const container = containerRefs[key as keyof typeof containerRefs].current;
        if (container) {
          container.removeEventListener('scroll', () => checkScrollPosition(key as keyof typeof containerRefs));
        }
      });
    };
  }, [activeTab, starWarsMovies, harryPotterMovies, lordOfTheRingsMovies, trilogies]);
  
  // Handle scroll
  const handleScroll = (direction: 'left' | 'right', key: keyof typeof containerRefs) => {
    const container = containerRefs[key].current;
    if (!container) return;
    
    const scrollAmount = container.clientWidth * 0.8;
    const newPosition = direction === 'left' 
      ? Math.max(container.scrollLeft - scrollAmount, 0) 
      : Math.min(container.scrollLeft + scrollAmount, container.scrollWidth - container.clientWidth);
    
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Coleções</h2>
      
      <Tabs defaultValue="trilogies" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 bg-gray-800/50">
          <TabsTrigger value="trilogies">Trilogias icônicas</TabsTrigger>
          <TabsTrigger value="starWars">Star Wars</TabsTrigger>
          <TabsTrigger value="harryPotter">Harry Potter</TabsTrigger>
          <TabsTrigger value="lotr">Senhor dos Anéis</TabsTrigger>
          <TabsTrigger value="batman">Batman Collection</TabsTrigger>
          <TabsTrigger value="superman">Superman Collection</TabsTrigger>
        </TabsList>
        
        {/* Trilogies Tab */}
        <TabsContent value="trilogies">
          <div className="relative">
            <button 
              onClick={() => handleScroll('left', 'trilogies')}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-opacity",
                showLeftArrows.trilogies ? "opacity-80" : "opacity-0 pointer-events-none"
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            
            <div 
              ref={containerRefs.trilogies}
              className="flex space-x-4 overflow-x-scroll scrollbar-hide pb-4 pt-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {trilogies.map((item) => (
                <CollectionItem key={item.id} item={item} onMediaClick={onMediaClick} />
              ))}
            </div>
            
            <button 
              onClick={() => handleScroll('right', 'trilogies')}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-opacity",
                showRightArrows.trilogies ? "opacity-80" : "opacity-0 pointer-events-none"
              )}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </div>
        </TabsContent>
        
        {/* Star Wars Tab */}
        <TabsContent value="starWars">
          <div className="relative">
            <button 
              onClick={() => handleScroll('left', 'starWars')}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-opacity",
                showLeftArrows.starWars ? "opacity-80" : "opacity-0 pointer-events-none"
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            
            <div 
              ref={containerRefs.starWars}
              className="flex space-x-4 overflow-x-scroll scrollbar-hide pb-4 pt-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={`loading-${i}`} className="w-44 h-64 flex-none bg-gray-800/60 rounded-md animate-pulse"></div>
                ))
              ) : (
                starWarsMovies.map((item) => (
                  <CollectionItem key={item.id} item={item} onMediaClick={onMediaClick} />
                ))
              )}
            </div>
            
            <button 
              onClick={() => handleScroll('right', 'starWars')}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-opacity",
                showRightArrows.starWars ? "opacity-80" : "opacity-0 pointer-events-none"
              )}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </div>
        </TabsContent>
        
        {/* Harry Potter Tab */}
        <TabsContent value="harryPotter">
          <div className="relative">
            <button 
              onClick={() => handleScroll('left', 'harryPotter')}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-opacity",
                showLeftArrows.harryPotter ? "opacity-80" : "opacity-0 pointer-events-none"
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            
            <div 
              ref={containerRefs.harryPotter}
              className="flex space-x-4 overflow-x-scroll scrollbar-hide pb-4 pt-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={`loading-${i}`} className="w-44 h-64 flex-none bg-gray-800/60 rounded-md animate-pulse"></div>
                ))
              ) : (
                harryPotterMovies.map((item) => (
                  <CollectionItem key={item.id} item={item} onMediaClick={onMediaClick} />
                ))
              )}
            </div>
            
            <button 
              onClick={() => handleScroll('right', 'harryPotter')}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-opacity",
                showRightArrows.harryPotter ? "opacity-80" : "opacity-0 pointer-events-none"
              )}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </div>
        </TabsContent>
        
        {/* Lord of the Rings Tab */}
        <TabsContent value="lotr">
          <div className="relative">
            <button 
              onClick={() => handleScroll('left', 'lotr')}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-opacity",
                showLeftArrows.lotr ? "opacity-80" : "opacity-0 pointer-events-none"
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            
            <div 
              ref={containerRefs.lotr}
              className="flex space-x-4 overflow-x-scroll scrollbar-hide pb-4 pt-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={`loading-${i}`} className="w-44 h-64 flex-none bg-gray-800/60 rounded-md animate-pulse"></div>
                ))
              ) : (
                lordOfTheRingsMovies.map((item) => (
                  <CollectionItem key={item.id} item={item} onMediaClick={onMediaClick} />
                ))
              )}
            </div>
            
            <button 
              onClick={() => handleScroll('right', 'lotr')}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-opacity",
                showRightArrows.lotr ? "opacity-80" : "opacity-0 pointer-events-none"
              )}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </div>
        </TabsContent>
        
        {/* Batman Tab */}
        <TabsContent value="batman">
          <div className="relative">
            <button 
              onClick={() => handleScroll('left', 'batman')}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-opacity",
                showLeftArrows.batman ? "opacity-80" : "opacity-0 pointer-events-none"
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            
            <div 
              ref={containerRefs.batman}
              className="flex space-x-4 overflow-x-scroll scrollbar-hide pb-4 pt-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {batmanMovies.map((item) => (
                <CollectionItem key={item.id} item={item} onMediaClick={onMediaClick} />
              ))}
            </div>
            
            <button 
              onClick={() => handleScroll('right', 'batman')}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-opacity",
                showRightArrows.batman ? "opacity-80" : "opacity-0 pointer-events-none"
              )}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </div>
        </TabsContent>
        
        {/* Superman Tab */}
        <TabsContent value="superman">
          <div className="relative">
            <button 
              onClick={() => handleScroll('left', 'superman')}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-opacity",
                showLeftArrows.superman ? "opacity-80" : "opacity-0 pointer-events-none"
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            
            <div 
              ref={containerRefs.superman}
              className="flex space-x-4 overflow-x-scroll scrollbar-hide pb-4 pt-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {supermanMovies.map((item) => (
                <CollectionItem key={item.id} item={item} onMediaClick={onMediaClick} />
              ))}
            </div>
            
            <button 
              onClick={() => handleScroll('right', 'superman')}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-opacity",
                showRightArrows.superman ? "opacity-80" : "opacity-0 pointer-events-none"
              )}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface CollectionItemProps {
  item: MediaItem;
  onMediaClick: (media: MediaItem) => void;
}

const CollectionItem: React.FC<CollectionItemProps> = ({ item, onMediaClick }) => {
  return (
    <div 
      className="w-44 flex-none relative group cursor-pointer"
      onClick={() => onMediaClick(item)}
    >
      <div className="relative overflow-hidden rounded-md">
        <img 
          src={`https://image.tmdb.org/t/p/w500${item.poster_path || item.backdrop_path}`}
          alt={item.title || item.name || ''}
          className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
          <div className="p-3">
            <h3 className="text-white text-sm font-medium">{item.title || item.name}</h3>
            {item.vote_average && (
              <div className="flex items-center mt-1">
                <span className="text-yellow-400 text-xs">★ {item.vote_average.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsSection;

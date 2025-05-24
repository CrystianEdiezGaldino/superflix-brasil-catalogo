
import React from 'react';
import { MediaItem } from '@/types/movie';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Universos Cinematográficos</h2>
      
      <Tabs defaultValue="marvel" className="w-full">
        <TabsList className="mb-4 bg-gray-800/50">
          <TabsTrigger value="marvel">Marvel</TabsTrigger>
          <TabsTrigger value="dc">DC Comics</TabsTrigger>
          <TabsTrigger value="harry-potter">Harry Potter</TabsTrigger>
          <TabsTrigger value="star-wars">Star Wars</TabsTrigger>
          <TabsTrigger value="lotr">Senhor dos Anéis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="marvel">
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Universo Marvel</h3>
            </div>
            <p className="text-sm text-gray-400">Explore o Universo Cinematográfico Marvel com seus super-heróis e histórias interconectadas.</p>
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex space-x-4 pb-4">
              {marvelMovies?.map((item) => (
                <FranchiseItem key={item.id} item={item} onMediaClick={onMediaClick} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="dc">
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Universo DC</h3>
            </div>
            <p className="text-sm text-gray-400">Mergulhe no universo dos super-heróis da DC Comics.</p>
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex space-x-4 pb-4">
              {dcMovies?.map((item) => (
                <FranchiseItem key={item.id} item={item} onMediaClick={onMediaClick} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="harry-potter">
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Especial Harry Potter</h3>
            </div>
            <p className="text-sm text-gray-400">O mundo mágico de Harry Potter em uma coleção completa.</p>
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex space-x-4 pb-4">
              {harryPotterMovies.map((item) => (
                <FranchiseItem key={item.id} item={item} onMediaClick={onMediaClick} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="star-wars">
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Especial Star Wars</h3>
            </div>
            <p className="text-sm text-gray-400">Uma galáxia muito, muito distante com todos os filmes e séries de Star Wars.</p>
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex space-x-4 pb-4">
              {starWarsMovies.map((item) => (
                <FranchiseItem key={item.id} item={item} onMediaClick={onMediaClick} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="lotr">
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Especial Senhor dos Anéis</h3>
            </div>
            <p className="text-sm text-gray-400">A jornada completa pela Terra Média com todos os filmes de Senhor dos Anéis e O Hobbit.</p>
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex space-x-4 pb-4">
              {lordOfTheRingsMovies.map((item) => (
                <FranchiseItem key={item.id} item={item} onMediaClick={onMediaClick} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsContent>
      </Tabs>
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

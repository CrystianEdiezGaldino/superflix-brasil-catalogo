
import React from 'react';
import { MediaItem } from '@/types/movie';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Coleções</h2>
      
      <Tabs defaultValue="trilogies" className="w-full">
        <TabsList className="mb-4 bg-gray-800/50">
          <TabsTrigger value="trilogies">Trilogias icônicas</TabsTrigger>
          <TabsTrigger value="batman">Batman Collection</TabsTrigger>
          <TabsTrigger value="superman">Superman Collection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trilogies">
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex space-x-4 pb-4">
              {trilogies.map((item) => (
                <CollectionItem key={item.id} item={item} onMediaClick={onMediaClick} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="batman">
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex space-x-4 pb-4">
              {batmanMovies.map((item) => (
                <CollectionItem key={item.id} item={item} onMediaClick={onMediaClick} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="superman">
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex space-x-4 pb-4">
              {supermanMovies.map((item) => (
                <CollectionItem key={item.id} item={item} onMediaClick={onMediaClick} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
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

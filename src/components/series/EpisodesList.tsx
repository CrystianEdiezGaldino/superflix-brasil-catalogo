
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Season } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EpisodeCard from "./EpisodeCard";

interface EpisodesListProps {
  seasonData: Season | null;
  seasons: number[];
  selectedSeason: number;
  selectedEpisode: number;
  setSelectedSeason: (season: number) => void;
  handleEpisodeSelect: (episodeNumber: number) => void;
  isLoading: boolean;
}

const EpisodesList = ({ 
  seasonData, 
  seasons, 
  selectedSeason, 
  selectedEpisode, 
  setSelectedSeason, 
  handleEpisodeSelect, 
  isLoading 
}: EpisodesListProps) => {
  const [showEpisodes, setShowEpisodes] = useState(false);

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Episódios</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white"
          onClick={() => setShowEpisodes(!showEpisodes)}
        >
          {showEpisodes ? (
            <>
              <ChevronUp className="mr-2" size={18} />
              Ocultar
            </>
          ) : (
            <>
              <ChevronDown className="mr-2" size={18} />
              Mostrar
            </>
          )}
        </Button>
      </div>
      
      {showEpisodes && (
        <div className="mt-4">
          <Tabs defaultValue={selectedSeason.toString()} onValueChange={(value) => setSelectedSeason(Number(value))}>
            <TabsList className="bg-gray-900 mb-4 overflow-x-auto flex-wrap">
              {seasons.map((season) => (
                <TabsTrigger key={season} value={season.toString()}>
                  Temporada {season}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {seasons.map((season) => (
              <TabsContent key={season} value={season.toString()} className="animate-fade-in">
                {!isLoading && seasonData && seasonData.episodes ? (
                  <div className="space-y-4">
                    {seasonData.episodes.map((episode) => (
                      <EpisodeCard
                        key={episode.id}
                        episode={episode}
                        isSelected={selectedEpisode === episode.episode_number}
                        onSelect={handleEpisodeSelect}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Carregando episódios...</p>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default EpisodesList;


import { Dispatch, SetStateAction } from "react";
import EpisodeCard from "./EpisodeCard";
import { SelectContent, SelectGroup, Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Lock, ChevronDown, ChevronUp, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface EpisodesListProps {
  seasonData: any;
  seasons: number[];
  selectedSeason: number;
  selectedEpisode: number;
  setSelectedSeason: Dispatch<SetStateAction<number>>;
  handleEpisodeSelect: (episodeNumber: number) => void;
  isLoading: boolean;
  hasAccess?: boolean;
}

const EpisodesList = ({
  seasonData,
  seasons,
  selectedSeason,
  selectedEpisode,
  setSelectedSeason,
  handleEpisodeSelect,
  isLoading,
  hasAccess = true
}: EpisodesListProps) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen} 
      className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 overflow-hidden"
    >
      <div className="px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
          <span className="bg-netflix-red h-6 w-1 rounded-full hidden sm:block"></span>
          <span>Episódios</span>
          {seasons.length > 0 && (
            <span className="ml-1 text-xs sm:text-sm bg-netflix-red px-2 py-0.5 rounded-full">
              {seasonData?.episodes?.length || 0}
            </span>
          )}
        </h2>
        
        <div className="flex items-center gap-4">
          {seasons.length > 1 && (
            <Select
              value={selectedSeason.toString()}
              onValueChange={(value) => setSelectedSeason(Number(value))}
            >
              <SelectTrigger className="w-28 sm:w-40 bg-gray-800 border-gray-700 text-sm sm:text-base">
                <SelectValue placeholder="Temporada" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectGroup>
                  {seasons.map((season) => (
                    <SelectItem key={season} value={season.toString()}>
                      Temporada {season}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-800">
              {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      
      <CollapsibleContent>
        <div className="px-4 sm:px-6 pb-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !hasAccess ? (
            <div className="space-y-6">
              {/* Mostrar apenas prévia para usuários sem acesso */}
              {seasonData?.episodes?.slice(0, 2).map((episode: any) => (
                <EpisodeCard
                  key={episode.id}
                  episode={episode}
                  isSelected={episode.episode_number === selectedEpisode}
                  onSelect={handleEpisodeSelect}
                />
              ))}
              
              {/* Conteúdo bloqueado - design melhorado */}
              <Card className="p-6 sm:p-8 bg-gray-800/70 border-gray-700 text-center backdrop-blur-sm">
                <div className="mb-6 flex justify-center">
                  <Lock size={40} className="text-netflix-red" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Conteúdo restrito para assinantes
                </h3>
                <p className="text-gray-300 mb-6 max-w-md mx-auto">
                  Assine para ter acesso a todos os episódios desta série e muito mais conteúdo exclusivo.
                </p>
                <Link to="/subscribe">
                  <Button className="bg-netflix-red hover:bg-red-700 px-6 py-2 font-medium">
                    Ver planos de assinatura
                  </Button>
                </Link>
              </Card>
            </div>
          ) : (
            <div className="grid gap-3 mt-4">
              {seasonData?.episodes?.map((episode: any) => (
                <EpisodeCard
                  key={episode.id}
                  episode={episode}
                  isSelected={episode.episode_number === selectedEpisode}
                  onSelect={handleEpisodeSelect}
                />
              ))}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default EpisodesList;


import { Dispatch, SetStateAction } from "react";
import EpisodeCard from "./EpisodeCard";
import { SelectContent, SelectGroup, Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Episódios</h2>
        
        {seasons.length > 1 && (
          <Select
            value={selectedSeason.toString()}
            onValueChange={(value) => setSelectedSeason(Number(value))}
          >
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
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
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-20">
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
              onClick={handleEpisodeSelect}
            />
          ))}
          
          {/* Conteúdo bloqueado */}
          <Card className="p-6 bg-gray-800/50 border-gray-700 text-center">
            <div className="mb-4 flex justify-center">
              <Lock size={40} className="text-netflix-red" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Conteúdo restrito para assinantes
            </h3>
            <p className="text-gray-300 mb-4">
              Assine para ter acesso a todos os episódios desta série e muito mais conteúdo.
            </p>
            <Link to="/subscribe">
              <Button className="bg-netflix-red hover:bg-red-700">
                Ver planos de assinatura
              </Button>
            </Link>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {seasonData?.episodes?.map((episode: any) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              isSelected={episode.episode_number === selectedEpisode}
              onClick={handleEpisodeSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EpisodesList;


import { Series } from "@/types/movie";
import { Button } from "@/components/ui/button";

interface SeriesInfoProps {
  series: Series;
  showPlayer: boolean;
  setShowPlayer: (value: boolean) => void;
}

const SeriesInfo = ({ series, showPlayer, setShowPlayer }: SeriesInfoProps) => {
  const releaseYear = series.first_air_date
    ? new Date(series.first_air_date).getFullYear()
    : null;
  
  const imdbId = series.external_ids?.imdb_id;

  return (
    <div className="flex-1">
      <h1 className="text-3xl md:text-4xl font-bold text-white">
        {series.name} {releaseYear && <span className="font-normal text-gray-400">({releaseYear})</span>}
      </h1>
      
      <div className="flex items-center gap-3 mt-4">
        <span className="px-2 py-1 bg-netflix-red rounded text-xs text-white">
          {Math.round(series.vote_average * 10)}% Aprovação
        </span>
        <span className="text-gray-400">{series.first_air_date}</span>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-white mb-2">Sinopse</h2>
        <p className="text-gray-300">{series.overview || "Nenhuma sinopse disponível."}</p>
      </div>

      {imdbId && (
        <div className="mt-8">
          <Button 
            onClick={() => setShowPlayer(!showPlayer)} 
            className="bg-netflix-red hover:bg-red-700"
          >
            {showPlayer ? "Ocultar Player" : "Assistir Agora"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SeriesInfo;

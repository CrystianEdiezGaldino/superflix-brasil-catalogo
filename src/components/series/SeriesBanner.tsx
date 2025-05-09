
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Series } from "@/types/movie";

interface SeriesBannerProps {
  series: Series;
}

const SeriesBanner = ({ series }: SeriesBannerProps) => {
  return (
    <div className="relative h-[50vh] md:h-[70vh]">
      <div className="absolute inset-0">
        {series.backdrop_path ? (
          <img
            src={`https://image.tmdb.org/t/p/original${series.backdrop_path}`}
            alt={series.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-900"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-background via-netflix-background/70 to-transparent"></div>
      </div>
      
      <Link to="/filmes" className="absolute top-6 left-6 z-10">
        <Button variant="ghost" size="icon" className="rounded-full bg-black/50 hover:bg-black/70">
          <ArrowLeft className="text-white" />
        </Button>
      </Link>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{series.name}</h1>
        {series.first_air_date && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>{new Date(series.first_air_date).getFullYear()}</span>
            {series.number_of_seasons && (
              <span>• {series.number_of_seasons} {series.number_of_seasons > 1 ? "Temporadas" : "Temporada"}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesBanner;

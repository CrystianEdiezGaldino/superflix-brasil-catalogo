
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
      
      <Link to="/" className="absolute top-6 left-6 z-10">
        <Button variant="ghost" size="icon" className="rounded-full bg-black/50">
          <ArrowLeft className="text-white" />
        </Button>
      </Link>
    </div>
  );
};

export default SeriesBanner;

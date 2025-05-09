
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Series } from "@/types/movie";
import SeriesBanner from "./SeriesBanner";

interface SeriesHeaderProps {
  series: Series;
  isFavorite: boolean;
  toggleFavorite: () => void;
}

const SeriesHeader = ({
  series,
  isFavorite,
  toggleFavorite
}: SeriesHeaderProps) => {
  return (
    <SeriesBanner 
      series={series} 
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
    />
  );
};

export default SeriesHeader;

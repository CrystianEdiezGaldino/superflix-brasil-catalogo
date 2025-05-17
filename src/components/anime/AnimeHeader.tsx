
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Series } from "@/types/movie";
import SeriesBanner from "../series/SeriesBanner";
import { useState, useEffect } from "react";

interface AnimeHeaderProps {
  anime: Series;
  isFavorite: boolean;
  toggleFavorite: () => void;
}

const AnimeHeader = ({
  anime,
  isFavorite,
  toggleFavorite
}: AnimeHeaderProps) => {
  return (
    <SeriesBanner 
      series={anime} 
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
    />
  );
};

export default AnimeHeader;

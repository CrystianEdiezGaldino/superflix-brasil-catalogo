
import { MediaItem } from "@/types/movie";

export const selectRandomBackground = (mediaItems: MediaItem[]): string => {
  // Filtrar apenas itens com imagem de fundo
  const itemsWithBackdrop = mediaItems.filter(item => item.backdrop_path);
  
  if (itemsWithBackdrop.length === 0) {
    return "";
  }
  
  const randomIndex = Math.floor(Math.random() * itemsWithBackdrop.length);
  const randomMedia = itemsWithBackdrop[randomIndex];
  
  return randomMedia.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${randomMedia.backdrop_path}`
    : "";
};

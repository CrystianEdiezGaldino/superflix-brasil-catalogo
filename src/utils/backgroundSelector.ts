import { MediaItem } from "@/types/movie";

export const selectRandomBackground = (mediaItems: MediaItem[]): MediaItem | null => {
  // Filtrar apenas itens com imagem de fundo
  const itemsWithBackdrop = mediaItems.filter(item => item.backdrop_path);
  
  if (itemsWithBackdrop.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * itemsWithBackdrop.length);
  return itemsWithBackdrop[randomIndex];
};

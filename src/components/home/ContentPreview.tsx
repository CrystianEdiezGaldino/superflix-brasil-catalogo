
import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";
import { useState } from "react";

interface ContentPreviewProps {
  movies: MediaItem[];
  series?: MediaItem[];
  anime?: MediaItem[];
}

const ContentPreview = ({ movies, series = [], anime = [] }: ContentPreviewProps) => {
  const [focusedSection, setFocusedSection] = useState(0);
  const [focusedItem, setFocusedItem] = useState(0);

  // Filtrar apenas conteúdos com imagens
  const filteredMovies = movies.filter(movie => movie.poster_path || movie.backdrop_path);
  const filteredSeries = series.filter(serie => serie.poster_path || serie.backdrop_path);
  const filteredAnime = anime.filter(item => item.poster_path || item.backdrop_path);

  const sections = [
    { title: "Filmes Populares (Prévia)", items: filteredMovies },
    { title: "Séries Populares (Prévia)", items: filteredSeries },
    { title: "Anime em Alta (Prévia)", items: filteredAnime }
  ].filter(section => section.items.length > 0);
  
  const handleKeyNavigation = (sectionIndex: number, e: React.KeyboardEvent) => {
    if (sectionIndex === focusedSection) {
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          setFocusedItem(prev => Math.min(prev + 1, sections[sectionIndex].items.length - 1));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedItem(prev => Math.max(prev - 1, 0));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedSection(prev => Math.min(prev + 1, sections.length - 1));
          setFocusedItem(0);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedSection(prev => Math.max(prev - 1, 0));
          setFocusedItem(0);
          break;
      }
    }
  };
  
  return (
    <div className="space-y-8">
      {sections.map((section, sectionIndex) => (
        <MediaSection 
          key={section.title}
          title={section.title}
          medias={section.items.slice(0, 10)}
          focusedItem={sectionIndex === focusedSection ? focusedItem : -1}
          onFocusChange={(idx) => {
            setFocusedSection(sectionIndex);
            setFocusedItem(idx);
          }}
        />
      ))}
    </div>
  );
};

export default ContentPreview;

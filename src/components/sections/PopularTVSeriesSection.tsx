
import React, { useState } from 'react';
import { MediaItem } from '@/types/movie';
import MediaCard from '@/components/media/MediaCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface PopularTVSeriesSectionProps {
  title: string;
  series: MediaItem[];
  onSeriesClick: (series: MediaItem) => void;
  isLoading?: boolean;
}

export function PopularTVSeriesSection({ 
  title, 
  series, 
  onSeriesClick, 
  isLoading = false 
}: PopularTVSeriesSectionProps) {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Filtrar séries que não possuem imagens
  const seriesWithImages = series.filter(serie => 
    serie && 
    serie.poster_path && 
    serie.backdrop_path &&
    serie.poster_path !== null && 
    serie.backdrop_path !== null &&
    serie.poster_path.trim() !== '' &&
    serie.backdrop_path.trim() !== ''
  );

  // Se não há séries com imagens, não renderizar a seção
  if (seriesWithImages.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <SectionTitle>{title}</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {seriesWithImages.map((serie, index) => (
          <MediaCard
            key={`${serie.media_type}-${serie.id}`}
            media={serie}
            index={index}
            isFocused={focusedIndex === index}
            onFocus={setFocusedIndex}
            onClick={() => onSeriesClick(serie)}
          />
        ))}
      </div>
    </section>
  );
}

export default PopularTVSeriesSection;

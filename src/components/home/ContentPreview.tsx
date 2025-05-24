
import React, { useState } from 'react';
import { MediaItem } from '@/types/movie';
import MediaSection from '@/components/MediaSection';

interface ContentPreviewProps {
  movies: MediaItem[];
  series: MediaItem[];
  animes: MediaItem[];
  onMovieClick: (media: MediaItem) => void;
  onSeriesClick: (media: MediaItem) => void;
  onAnimeClick: (media: MediaItem) => void;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
  movies,
  series,
  animes,
  onMovieClick,
  onSeriesClick,
  onAnimeClick
}) => {
  const [focusedSection, setFocusedSection] = useState(0);
  const [focusedItem, setFocusedItem] = useState(0);
  
  const handleFocusChange = (section: number, item: number) => {
    setFocusedSection(section);
    setFocusedItem(item);
  };
  
  return (
    <div className="content-preview space-y-8 pt-6">
      {movies && movies.length > 0 && (
        <MediaSection
          key="preview-movies"
          title="Filmes em destaque"
          medias={movies}
          onLoadMore={() => {}}
          sectionIndex={0}
          onMediaClick={onMovieClick}
          focusedItem={focusedSection === 0 ? focusedItem : -1}
          onFocusChange={(idx) => handleFocusChange(0, idx)}
        />
      )}
      
      {series && series.length > 0 && (
        <MediaSection
          key="preview-series"
          title="Séries em destaque"
          medias={series}
          onLoadMore={() => {}}
          sectionIndex={1}
          onMediaClick={onSeriesClick}
          focusedItem={focusedSection === 1 ? focusedItem : -1}
          onFocusChange={(idx) => handleFocusChange(1, idx)}
        />
      )}
      
      {animes && animes.length > 0 && (
        <MediaSection
          key="preview-animes"
          title="Animes em destaque"
          medias={animes}
          onLoadMore={() => {}}
          sectionIndex={2}
          onMediaClick={onAnimeClick}
          focusedItem={focusedSection === 2 ? focusedItem : -1}
          onFocusChange={(idx) => handleFocusChange(2, idx)}
        />
      )}
    </div>
  );
};

export default ContentPreview;

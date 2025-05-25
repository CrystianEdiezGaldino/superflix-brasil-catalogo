
import React, { useEffect, useState } from 'react';
import { MediaItem } from '@/types/movie';
import { fetchFamilyMovies } from '@/services/tmdb/familyMovies';
import MediaCard from '@/components/media/MediaCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface FamilyMoviesSectionProps {
  title: string;
  onMediaClick: (media: MediaItem) => void;
}

export default function FamilyMoviesSection({ title, onMediaClick }: FamilyMoviesSectionProps) {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchFamilyMovies(100);
        setMovies(data);
      } catch (error) {
        console.error('Error loading family movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="py-8">
      <SectionTitle>{title}</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie, index) => (
          <MediaCard
            key={`${movie.media_type}-${movie.id}`}
            media={movie}
            index={index}
            isFocused={focusedIndex === index}
            onFocus={setFocusedIndex}
            onClick={() => onMediaClick(movie)}
          />
        ))}
      </div>
    </section>
  );
}

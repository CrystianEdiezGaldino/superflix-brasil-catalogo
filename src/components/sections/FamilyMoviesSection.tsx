import { MediaItem } from "@/types/movie";
import MediaCard from "@/components/media/MediaCard";
import { useState, useEffect } from "react";
import { fetchFamilyContent } from "@/services/tmdb/family";

interface FamilyMoviesSectionProps {
  title: string;
  onMediaClick: (media: MediaItem) => void;
}

const FamilyMoviesSection = ({ title, onMediaClick }: FamilyMoviesSectionProps) => {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const familyMovies = await fetchFamilyContent(50);
        
        if (isMounted) {
          if (familyMovies.length === 0) {
            setError("Não foi possível carregar os filmes familiares no momento.");
          } else {
            setMovies(familyMovies);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error loading family movies:", error);
          setError("Ocorreu um erro ao carregar os filmes familiares.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMovies();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="w-full h-40 bg-gray-800/60 rounded-md animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie, index) => (
          <MediaCard
            key={`${movie.id}-${index}`}
            media={movie}
            index={index}
            isFocused={false}
            onFocus={() => {}}
            onClick={() => onMediaClick(movie)}
          />
        ))}
      </div>
    </div>
  );
};

export default FamilyMoviesSection;

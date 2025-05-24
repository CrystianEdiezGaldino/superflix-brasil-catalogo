
import MediaSection from "@/components/MediaSection";
import { useQuery } from "@tanstack/react-query";
import { fetchMarvelMovies } from "@/services/tmdbApi";
import { MediaItem } from "@/types/movie";

export const MarvelSection = () => {
  const { data: marvelMovies = [] } = useQuery({
    queryKey: ["marvel-movies"],
    queryFn: () => fetchMarvelMovies(30)
  });
  
  const handleMovieClick = (media: MediaItem) => {
    // Placeholder function, could be replaced with actual navigation
    console.log("Marvel movie clicked:", media.title || media.name);
  };

  return (
    <div className="space-y-8">
      <MediaSection
        title="Filmes da Marvel"
        medias={marvelMovies}
        showLoadMore={false}
        sectionIndex={0}
        onMediaClick={handleMovieClick}
        onLoadMore={() => {}}
      />
    </div>
  );
}; 

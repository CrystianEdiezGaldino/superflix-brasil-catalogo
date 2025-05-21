import MediaSection from "@/components/MediaSection";
import { useQuery } from "@tanstack/react-query";
import { fetchMarvelMovies } from "@/services/tmdbApi";

export const MarvelSection = () => {
  const { data: marvelMovies = [] } = useQuery({
    queryKey: ["marvel-movies"],
    queryFn: () => fetchMarvelMovies(30)
  });

  return (
    <div className="space-y-8">
      <MediaSection
        title="Filmes da Marvel"
        medias={marvelMovies}
        showLoadMore={false}
        sectionIndex={0}
      />
    </div>
  );
}; 

import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";

interface AnimeSectionsProps {
  anime: MediaItem[];
  topRatedAnime: MediaItem[];
  recentAnimes: MediaItem[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: (sectionId: string) => void;
  onMediaClick: (media: MediaItem) => void;
}

const AnimeSections = ({
  anime,
  topRatedAnime,
  recentAnimes,
  isLoading,
  hasMore,
  onLoadMore,
  onMediaClick,
}: AnimeSectionsProps) => {
  if (!anime.length && 
      !topRatedAnime.length && 
      !recentAnimes.length) {
    return null;
  }

  return (
    <div className="space-y-8 mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-white">Animes</h2>

      {anime.length > 0 && (
        <MediaSection
          title="Animes em Alta"
          medias={anime}
          showLoadMore={hasMore}
          onLoadMore={() => onLoadMore('anime')}
          isLoading={isLoading}
          onMediaClick={onMediaClick}
          sectionId="anime"
          mediaType="anime"
          sectionIndex={0}
        />
      )}

      {topRatedAnime.length > 0 && (
        <MediaSection
          title="Animes Mais Bem Avaliados"
          medias={topRatedAnime}
          showLoadMore={hasMore}
          onLoadMore={() => onLoadMore('topRatedAnime')}
          isLoading={isLoading}
          onMediaClick={onMediaClick}
          sectionId="topRatedAnime" 
          mediaType="anime"
          sectionIndex={1}
        />
      )}

      {recentAnimes.length > 0 && (
        <MediaSection
          title="Animes Recentes"
          medias={recentAnimes}
          showLoadMore={hasMore}
          onLoadMore={() => onLoadMore('recentAnimes')}
          isLoading={isLoading}
          onMediaClick={onMediaClick}
          sectionId="recentAnimes"
          mediaType="anime"
          sectionIndex={2}
        />
      )}
    </div>
  );
};

export default AnimeSections;

import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";

interface AnimeSectionsProps {
  anime: MediaItem[];
  topRatedAnime: MediaItem[];
  recentAnimes: MediaItem[];
  isLoading: boolean;
  hasMore: {
    anime: boolean;
    topRated: boolean;
    recent: boolean;
  };
  isFetchingNextPage: {
    anime: boolean;
    topRated: boolean;
    recent: boolean;
  };
  onLoadMore: {
    anime: () => void;
    topRated: () => void;
    recent: () => void;
  };
  onMediaClick: (media: MediaItem) => void;
}

const AnimeSections = ({
  anime,
  topRatedAnime,
  recentAnimes,
  isLoading,
  hasMore,
  isFetchingNextPage,
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
          showLoadMore={hasMore.anime}
          onLoadMore={onLoadMore.anime}
          isLoading={isFetchingNextPage.anime}
          onMediaClick={onMediaClick}
          sectionId="anime"
          mediaType="tv"
          sectionIndex={0}
        />
      )}

      {topRatedAnime.length > 0 && (
        <MediaSection
          title="Animes Mais Bem Avaliados"
          medias={topRatedAnime}
          showLoadMore={hasMore.topRated}
          onLoadMore={onLoadMore.topRated}
          isLoading={isFetchingNextPage.topRated}
          onMediaClick={onMediaClick}
          sectionId="topRatedAnime" 
          mediaType="tv"
          sectionIndex={1}
        />
      )}

      {recentAnimes.length > 0 && (
        <MediaSection
          title="Animes Recentes"
          medias={recentAnimes}
          showLoadMore={hasMore.recent}
          onLoadMore={onLoadMore.recent}
          isLoading={isFetchingNextPage.recent}
          onMediaClick={onMediaClick}
          sectionId="recentAnimes"
          mediaType="tv"
          sectionIndex={2}
        />
      )}
    </div>
  );
};

export default AnimeSections;

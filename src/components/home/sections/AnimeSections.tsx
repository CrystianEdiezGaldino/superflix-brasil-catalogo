
import { MediaItem } from "@/types/movie";
import MediaSectionLoader from "../MediaSectionLoader";

interface AnimeSectionsProps {
  anime: MediaItem[];
  topRatedAnime: MediaItem[];
  recentAnimes?: MediaItem[];
  trendingAnime?: MediaItem[];
  onLoadMore?: (sectionId: string) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onMediaClick?: (media: MediaItem) => void;
}

const AnimeSections = ({
  anime,
  topRatedAnime,
  recentAnimes = [],
  trendingAnime = [],
  onLoadMore,
  isLoading = false,
  hasMore = false,
  onMediaClick
}: AnimeSectionsProps) => {
  // Funções específicas para cada seção
  const handleLoadMoreAnime = () => {
    if (onLoadMore) onLoadMore("anime");
  };
  
  const handleLoadMoreTopRatedAnime = () => {
    if (onLoadMore) onLoadMore("topRatedAnime");
  };
  
  const handleLoadMoreRecentAnimes = () => {
    if (onLoadMore) onLoadMore("recentAnimes");
  };
  
  const handleLoadMoreTrendingAnime = () => {
    if (onLoadMore) onLoadMore("trendingAnime");
  };
  
  return (
    <div className="anime-sections-container">
      {recentAnimes.length > 0 && (
        <MediaSectionLoader 
          title="Anime em Alta" 
          medias={recentAnimes}
          sectionId="recentAnimes"
          onLoadMore={handleLoadMoreRecentAnimes}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      <MediaSectionLoader 
        title="Animes Populares" 
        medias={anime}
        sectionId="anime"
        onLoadMore={handleLoadMoreAnime}
        isLoading={isLoading}
        hasMore={hasMore}
        onMediaClick={onMediaClick}
      />
      
      <MediaSectionLoader 
        title="Animes Bem Avaliados" 
        medias={topRatedAnime}
        sectionId="topRatedAnime"
        onLoadMore={handleLoadMoreTopRatedAnime}
        isLoading={isLoading}
        hasMore={hasMore}
        onMediaClick={onMediaClick}
      />
      
      {trendingAnime && trendingAnime.length > 0 && (
        <MediaSectionLoader 
          title="Animes em Alta no Brasil" 
          medias={trendingAnime}
          sectionId="trendingAnime"
          onLoadMore={handleLoadMoreTrendingAnime}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
    </div>
  );
};

export default AnimeSections;

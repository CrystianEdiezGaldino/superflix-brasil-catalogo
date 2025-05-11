
import { MediaItem } from "@/types/movie";
import MediaSectionLoader from "../MediaSectionLoader";

interface AnimeSectionsProps {
  anime: MediaItem[];
  topRatedAnime: MediaItem[];
  recentAnimes?: MediaItem[];
  trendingAnime?: MediaItem[];
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onMediaClick?: (media: MediaItem) => void;
}

const AnimeSections = ({
  anime,
  topRatedAnime,
  recentAnimes = [],
  trendingAnime = [],
  onLoadMore = () => {},
  isLoading = false,
  hasMore = false,
  onMediaClick
}: AnimeSectionsProps) => {
  // Funções específicas para cada seção
  const handleLoadMoreAnime = () => {
    onLoadMore();
    console.log("Carregando mais animes populares");
  };
  
  const handleLoadMoreTopRatedAnime = () => {
    onLoadMore();
    console.log("Carregando mais animes bem avaliados");
  };
  
  const handleLoadMoreRecentAnimes = () => {
    onLoadMore();
    console.log("Carregando mais animes recentes");
  };
  
  const handleLoadMoreTrendingAnime = () => {
    onLoadMore();
    console.log("Carregando mais animes em alta");
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
      
      {trendingAnime.length > 0 && (
        <MediaSectionLoader 
          title="Animes em Alta no Brasil" 
          medias={trendingAnime}
          sectionId="trendingAnime"
          onLoadMore={handleLoadMoreAnime}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
    </div>
  );
};

export default AnimeSections;

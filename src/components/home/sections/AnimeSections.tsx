
import React, { useRef } from "react";
import { MediaItem } from "@/types/movie";

interface AnimeSectionProps {
  anime: MediaItem[];
  topRatedAnime: MediaItem[];
  recentAnimes: MediaItem[];
  isLoading: boolean;
  hasMore: {
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
  isFetchingNextPage: {
    anime: boolean;
    topRated: boolean;
    recent: boolean;
  };
}

// Helper component to render a single section
const AnimeSection = ({
  title,
  anime,
  isLoading,
  hasMore,
  onLoadMore,
  onMediaClick,
  isFetchingNextPage,
}) => {
  if (!anime || anime.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {anime.map((item) => (
          <div
            key={item.id}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onMediaClick(item)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt={item.name || item.title}
              className="w-full h-auto rounded-md"
              loading="lazy"
            />
            <h3 className="text-white text-sm mt-1 truncate">
              {item.name || item.title}
            </h3>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
          </button>
        </div>
      )}
    </div>
  );
};

// Component for All Animes with Infinite Scroll
interface AllAnimesSectionProps {
  animes: MediaItem[];
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onMediaClick: (media: MediaItem) => void;
}

const AllAnimesSection: React.FC<AllAnimesSectionProps> = ({
  animes,
  isLoading,
  isFetchingMore,
  hasMore,
  onLoadMore,
  onMediaClick,
}) => {
  const loadingRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
          onLoadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [hasMore, isFetchingMore, onLoadMore]);

  if (!animes || animes.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Todos os Animes</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {animes.map((item) => (
          <div
            key={item.id}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onMediaClick(item)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt={item.name || item.title}
              className="w-full h-auto rounded-md"
              loading="lazy"
            />
            <h3 className="text-white text-sm mt-1 truncate">
              {item.name || item.title}
            </h3>
          </div>
        ))}
      </div>

      <div ref={loadingRef} className="h-10 mt-4 text-center">
        {isFetchingMore && (
          <div className="flex justify-center items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600 animate-pulse"></div>
            <div className="w-4 h-4 rounded-full bg-red-600 animate-pulse delay-100"></div>
            <div className="w-4 h-4 rounded-full bg-red-600 animate-pulse delay-200"></div>
          </div>
        )}
      </div>
    </div>
  );
};

const AnimeSections: React.FC<AnimeSectionProps> = ({
  anime,
  topRatedAnime,
  recentAnimes,
  isLoading,
  hasMore,
  onLoadMore,
  onMediaClick,
  isFetchingNextPage,
}) => {
  return (
    <div className="mt-8">
      <AnimeSection
        title="Animes em destaque"
        anime={anime}
        isLoading={isLoading}
        hasMore={hasMore.anime}
        onLoadMore={onLoadMore.anime}
        onMediaClick={onMediaClick}
        isFetchingNextPage={isFetchingNextPage.anime}
      />

      <AnimeSection
        title="Melhores animes"
        anime={topRatedAnime}
        isLoading={isLoading}
        hasMore={hasMore.topRated}
        onLoadMore={onLoadMore.topRated}
        onMediaClick={onMediaClick}
        isFetchingNextPage={isFetchingNextPage.topRated}
      />

      <AnimeSection
        title="Lançamentos recentes"
        anime={recentAnimes}
        isLoading={isLoading}
        hasMore={hasMore.recent}
        onLoadMore={onLoadMore.recent}
        onMediaClick={onMediaClick}
        isFetchingNextPage={isFetchingNextPage.recent}
      />

      <AllAnimesSection
        animes={anime}
        isLoading={isLoading}
        isFetchingMore={isFetchingNextPage.anime}
        hasMore={hasMore.anime}
        onLoadMore={onLoadMore.anime}
        onMediaClick={onMediaClick}
      />
    </div>
  );
};

export default AnimeSections;

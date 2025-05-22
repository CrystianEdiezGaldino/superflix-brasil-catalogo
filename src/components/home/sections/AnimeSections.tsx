import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";
import AllAnimesSection from "@/components/anime/AllAnimesSection";
import { Loader2 } from "lucide-react";

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
  // Garantir que todos os dados são arrays válidos
  const safeAnime = Array.isArray(anime) ? anime : [];
  const safeTopRatedAnime = Array.isArray(topRatedAnime) ? topRatedAnime : [];
  const safeRecentAnimes = Array.isArray(recentAnimes) ? recentAnimes : [];
  
  // Verificar se temos dados para mostrar, caso contrário mostrar um loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-netflix-red animate-spin" />
        <p className="mt-2 text-gray-400">Carregando animes...</p>
      </div>
    );
  }

  // Sempre renderizar as seções, mesmo se vazias
  return (
    <div className="space-y-8 mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-white">Animes</h2>

      {/* Seção de Todos os Animes */}
      <AllAnimesSection
        animes={safeAnime}
        isLoading={isLoading}
        isFetchingMore={isFetchingNextPage.anime}
        hasMore={hasMore.anime}
        onLoadMore={onLoadMore.anime}
        onMediaClick={onMediaClick}
      />

      {/* Outras seções - sempre renderizar */}
      <MediaSection
        title="Animes Mais Bem Avaliados"
        medias={safeTopRatedAnime.slice(0, 20)}
        showLoadMore={false}
        onLoadMore={onLoadMore.topRated}
        isLoading={isFetchingNextPage.topRated}
        onMediaClick={onMediaClick}
        sectionId="topRatedAnime" 
        mediaType="tv"
        sectionIndex={1}
      />

      <MediaSection
        title="Animes Recentes"
        medias={safeRecentAnimes.slice(0, 20)}
        showLoadMore={false}
        onLoadMore={onLoadMore.recent}
        isLoading={isFetchingNextPage.recent}
        onMediaClick={onMediaClick}
        sectionId="recentAnimes"
        mediaType="tv"
        sectionIndex={2}
      />
    </div>
  );
};

export default AnimeSections;

import { useQuery } from '@tanstack/react-query';
import { fetchSeriesRecommendations } from '@/services/tmdb/series';
import { Series } from '@/types/movie';
import MediaGrid from '@/components/media/MediaGrid';
import { useNavigate } from 'react-router-dom';

interface SeriesRecommendationsProps {
  seriesId: string;
}

const SeriesRecommendations = ({ seriesId }: SeriesRecommendationsProps) => {
  const navigate = useNavigate();

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['series-recommendations', seriesId],
    queryFn: () => fetchSeriesRecommendations(seriesId),
    staleTime: 1000 * 60 * 60, // 1 hora
    gcTime: 1000 * 60 * 60 * 24, // 24 horas
    enabled: !!seriesId, // Só executa se tiver um ID válido
    retry: 1, // Tenta apenas uma vez em caso de erro
    refetchOnWindowFocus: false, // Não recarrega quando a janela ganha foco
    refetchOnMount: false, // Não recarrega quando o componente é montado
    refetchOnReconnect: false, // Não recarrega quando reconecta
  });

  const handleMediaClick = (media: Series) => {
    navigate(`/dorama/${media.id}`);
  };

  if (isLoading || !recommendations?.results) {
    return null;
  }

  // Garante que recommendations.results é um array antes de filtrar
  const validRecommendations = Array.isArray(recommendations.results) 
    ? recommendations.results.filter((item): item is Series => item !== null)
    : [];

  if (validRecommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Recomendações</h2>
      <MediaGrid
        mediaItems={validRecommendations}
        onMediaClick={handleMediaClick}
        isLoading={isLoading}
        isLoadingMore={false}
        hasMore={false}
        isSearching={false}
        isFiltering={false}
        onLoadMore={() => {}}
        onResetFilters={() => {}}
      />
    </div>
  );
};

export default SeriesRecommendations; 
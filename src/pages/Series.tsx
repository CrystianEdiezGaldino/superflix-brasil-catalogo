
import { useQuery } from '@tanstack/react-query';
import MediaView from '@/components/media/MediaView';
import type { Series } from '@/types/movie';
import { useState, useEffect } from 'react';
import { getSeries } from '@/services/series';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MediaCardSkeleton from '@/components/media/MediaCardSkeleton';

const Series = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [page, setPage] = useState(1);
  const [allSeries, setAllSeries] = useState<Series[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['series', page],
    queryFn: () => getSeries(page),
    staleTime: 1000 * 60 * 60, // 1 hora
    gcTime: 1000 * 60 * 60 * 24, // 24 horas
  });

  // Atualiza a lista completa quando novos dados chegam
  useEffect(() => {
    if (data?.series) {
      if (page === 1) {
        setAllSeries(data.series);
        setIsInitialLoading(false);
      } else {
        // Adiciona apenas as novas séries que ainda não estão na lista
        setAllSeries(prev => {
          const currentSeries = prev || [];
          const newSeries = data.series.filter(
            newSerie => !currentSeries.some(existing => existing.id === newSerie.id)
          );
          return [...currentSeries, ...newSeries];
        });
      }
      setIsLoadingMore(false);
    }
  }, [data, page]);

  const handleMediaClick = (media: Series) => {
    if (media && media.id) {
      navigate(`/serie/${media.id}`);
    }
  };

  const handleLoadMore = () => {
    if (!isLoading && data?.total && allSeries.length < data.total && !isLoadingMore) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <p className="text-white">Erro ao carregar séries. Tente novamente mais tarde.</p>
      </div>
    );
  }

  const total = data?.total || 0;
  const hasMore = allSeries.length < total;

  // Cria um array de skeletons para mostrar durante o carregamento
  const loadingSkeletons = Array.from({ length: 10 }, (_, index) => (
    <MediaCardSkeleton key={`skeleton-${index}`} />
  ));

  return (
    <div className="min-h-screen bg-netflix-background">
      {isInitialLoading && (
        <div className="fixed inset-0 bg-netflix-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Loader2 className="w-8 h-8 text-netflix-red animate-spin" />
        </div>
      )}
      <MediaView
        title="Séries"
        type="tv"
        mediaItems={allSeries || []}
        isLoading={false}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        isFiltering={false}
        isSearching={false}
        page={page}
        yearFilter={yearFilter}
        ratingFilter={ratingFilter}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onYearFilterChange={setYearFilter}
        onRatingFilterChange={setRatingFilter}
        onLoadMore={handleLoadMore}
        onResetFilters={() => {
          setYearFilter('');
          setRatingFilter('');
          setSearchQuery('');
          setPage(1);
          setAllSeries([]);
          setIsInitialLoading(true);
        }}
        onMediaClick={handleMediaClick}
      />
      {isLoadingMore && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
          {loadingSkeletons}
        </div>
      )}
    </div>
  );
};

export default Series;

import { useQuery } from '@tanstack/react-query';
import MediaView from '@/components/media/MediaView';
import { Series } from '@/types/movie';
import { useState, useEffect } from 'react';
import { getDoramas } from '@/services/doramas';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MediaCardSkeleton from '@/components/media/MediaCardSkeleton';

const Doramas = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [page, setPage] = useState(1);
  const [allDoramas, setAllDoramas] = useState<Series[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { data, isLoading, error } = useQuery({
    queryKey: ['doramas', page],
    queryFn: () => getDoramas(page),
    staleTime: 1000 * 60 * 60, // 1 hora
    gcTime: 1000 * 60 * 60 * 24, // 24 horas
  });

  // Atualiza a lista completa quando novos dados chegam
  useEffect(() => {
    if (data?.doramas) {
      if (page === 1) {
        setAllDoramas(data.doramas);
        setIsInitialLoading(false);
      } else {
        // Adiciona apenas os novos doramas que ainda não estão na lista
        setAllDoramas(prev => {
          const newDoramas = data.doramas.filter(
            newDorama => !prev.some(existing => existing.id === newDorama.id)
          );
          return [...prev, ...newDoramas];
        });
      }
    }
  }, [data, page]);

  const handleMediaClick = (media: Series) => {
    navigate(`/dorama/${media.id}`);
  };

  const handleLoadMore = () => {
    if (!isLoading && data?.total && allDoramas.length < data.total) {
      setPage(prev => prev + 1);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <p className="text-white">Erro ao carregar doramas. Tente novamente mais tarde.</p>
      </div>
    );
  }

  const total = data?.total || 0;
  const hasMore = allDoramas.length < total;

  // Cria um array de skeletons para mostrar durante o carregamento
  const loadingSkeletons = Array.from({ length: 6 }, (_, index) => (
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
        title="Doramas"
        type="dorama"
        mediaItems={allDoramas}
        isLoading={false}
        isLoadingMore={isLoading && page > 1}
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
          setAllDoramas([]);
          setIsInitialLoading(true);
        }}
        onMediaClick={handleMediaClick}
      />
      {isLoading && page > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
          {loadingSkeletons}
        </div>
      )}
    </div>
  );
};

export default Doramas;

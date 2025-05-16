import { useQuery } from '@tanstack/react-query';
import MediaView from '@/components/media/MediaView';
import { Series } from '@/types/movie';
import { useState, useEffect } from 'react';
import { getDoramas } from '@/services/doramas';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MediaCardSkeleton from '@/components/media/MediaCardSkeleton';

const INITIAL_BATCH_SIZE = 10;
const SUBSEQUENT_BATCH_SIZE = 20;

const Doramas = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [page, setPage] = useState(1);
  const [allDoramas, setAllDoramas] = useState<Series[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [displayedDoramas, setDisplayedDoramas] = useState<Series[]>([]);
  const [currentBatchSize, setCurrentBatchSize] = useState(INITIAL_BATCH_SIZE);

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
        setDisplayedDoramas(data.doramas.slice(0, INITIAL_BATCH_SIZE));
        setIsInitialLoading(false);
        setIsProcessing(!data.isComplete);
      } else {
        setAllDoramas(prev => {
          const newDoramas = data.doramas.filter(
            newDorama => !prev.some(existing => existing.id === newDorama.id)
          );
          return [...prev, ...newDoramas];
        });
      }
    }
  }, [data, page]);

  // Efeito para controlar o carregamento gradual
  useEffect(() => {
    if (allDoramas.length > 0) {
      const nextBatchSize = page === 1 ? INITIAL_BATCH_SIZE : currentBatchSize + SUBSEQUENT_BATCH_SIZE;
      setDisplayedDoramas(allDoramas.slice(0, nextBatchSize));
      setCurrentBatchSize(nextBatchSize);
    }
  }, [allDoramas, page]);

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
        mediaItems={displayedDoramas}
        isLoading={isInitialLoading}
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
          setDisplayedDoramas([]);
          setCurrentBatchSize(INITIAL_BATCH_SIZE);
          setIsInitialLoading(true);
          setIsProcessing(false);
        }}
        onMediaClick={handleMediaClick}
      />
      {isProcessing && (
        <div className="fixed bottom-4 right-4 bg-netflix-background/90 backdrop-blur-sm p-4 rounded-lg shadow-lg flex items-center space-x-2">
          <Loader2 className="w-5 h-5 text-netflix-red animate-spin" />
          <span className="text-white text-sm">Processando mais doramas...</span>
        </div>
      )}
      {isLoading && page > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
          {loadingSkeletons}
        </div>
      )}
    </div>
  );
};

export default Doramas;

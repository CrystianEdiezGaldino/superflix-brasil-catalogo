import { useQuery } from '@tanstack/react-query';
import MediaView from '@/components/media/MediaView';
import { Series } from '@/types/movie';
import { useState, useEffect } from 'react';
import { getDoramas } from '@/services/doramas';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MediaCardSkeleton from '@/components/media/MediaCardSkeleton';

const INITIAL_DISPLAY_SIZE = 20;

const Doramas = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [allDoramas, setAllDoramas] = useState<Series[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [displayedDoramas, setDisplayedDoramas] = useState<Series[]>([]);
  const [total, setTotal] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['doramas'],
    queryFn: () => getDoramas((newDoramas, totalCount) => {
      if (newDoramas.length > 0) {
        setAllDoramas(newDoramas);
        setTotal(totalCount);
      }
    }),
    staleTime: 1000 * 60 * 60, // 1 hora
    gcTime: 1000 * 60 * 60 * 24, // 24 horas
  });

  // Atualiza a lista exibida quando novos dados chegam
  useEffect(() => {
    if (allDoramas.length > 0) {
      // Mostra todos os doramas disponíveis até o momento
      setDisplayedDoramas(allDoramas);
      setIsInitialLoading(false);
    }
  }, [allDoramas]);

  const handleMediaClick = (media: Series) => {
    navigate(`/dorama/${media.id}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <p className="text-white">Erro ao carregar doramas. Tente novamente mais tarde.</p>
      </div>
    );
  }

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
        isLoadingMore={isLoading}
        hasMore={false}
        isFiltering={false}
        isSearching={false}
        page={1}
        yearFilter={yearFilter}
        ratingFilter={ratingFilter}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onYearFilterChange={setYearFilter}
        onRatingFilterChange={setRatingFilter}
        onLoadMore={() => {}}
        onResetFilters={() => {
          setYearFilter('');
          setRatingFilter('');
          setSearchQuery('');
          setAllDoramas([]);
          setDisplayedDoramas([]);
          setIsInitialLoading(true);
        }}
        onMediaClick={handleMediaClick}
      />
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
          {loadingSkeletons}
        </div>
      )}
    </div>
  );
};

export default Doramas;

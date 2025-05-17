import { useQuery, useQueryClient } from '@tanstack/react-query';
import MediaView from '@/components/media/MediaView';
import { Series } from '@/types/movie';
import { useState, useEffect, useRef } from 'react';
import { getDoramas, pauseDoramasProcessing, resumeDoramasProcessing } from '@/services/doramas';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MediaCardSkeleton from '@/components/media/MediaCardSkeleton';
import { useInView } from 'react-intersection-observer';

const INITIAL_DISPLAY_SIZE = 20;

const Doramas = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [allDoramas, setAllDoramas] = useState<Series[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [displayedDoramas, setDisplayedDoramas] = useState<Series[]>([]);
  const [total, setTotal] = useState(0);
  const { ref, inView } = useInView();
  const location = useLocation();
  const isMounted = useRef(true);
  const controllerRef = useRef<AbortController | null>(null);
  const hasInitialized = useRef(false);

  // Efeito para controlar o ciclo de vida do componente
  useEffect(() => {
    isMounted.current = true;
    controllerRef.current = new AbortController();

    // Se já temos dados no cache, usamos eles
    const cachedData = queryClient.getQueryData(['doramas']);
    if (cachedData) {
      const { doramas, total } = cachedData as { doramas: Series[], total: number };
      setAllDoramas(doramas);
      setTotal(total);
      setDisplayedDoramas(doramas);
      setIsInitialLoading(false);
    }

    // Se houver doramas já processados, retoma o processamento
    if (allDoramas.length > 0 && !hasInitialized.current) {
      hasInitialized.current = true;
      resumeDoramasProcessing((newDoramas, totalCount) => {
        if (!controllerRef.current?.signal.aborted && isMounted.current) {
          setAllDoramas(newDoramas);
          setTotal(totalCount);
          setDisplayedDoramas(newDoramas);
          setIsInitialLoading(false);
          // Atualiza o cache do React Query
          queryClient.setQueryData(['doramas'], { doramas: newDoramas, total: totalCount });
        }
      }, controllerRef.current.signal);
    }

    return () => {
      isMounted.current = false;
      console.log('Componente Doramas desmontando...');
      pauseDoramasProcessing();
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
    };
  }, [queryClient]);

  // Efeito para pausar/retomar o processamento quando mudar de rota
  useEffect(() => {
    const handleRouteChange = () => {
      if (location.pathname !== '/doramas' && isMounted.current) {
        console.log('Mudando de rota, pausando processamento...');
        pauseDoramasProcessing();
      } else if (location.pathname === '/doramas' && isMounted.current) {
        console.log('Retornando à rota de doramas, retomando processamento...');
        controllerRef.current = new AbortController();
        resumeDoramasProcessing((newDoramas, totalCount) => {
          if (!controllerRef.current?.signal.aborted && isMounted.current) {
            setAllDoramas(newDoramas);
            setTotal(totalCount);
            setDisplayedDoramas(newDoramas);
            setIsInitialLoading(false);
            // Atualiza o cache do React Query
            queryClient.setQueryData(['doramas'], { doramas: newDoramas, total: totalCount });
          }
        }, controllerRef.current.signal);
      }
    };

    // Executa imediatamente ao montar o componente
    handleRouteChange();

    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [location, queryClient]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['doramas'],
    queryFn: async ({ signal }) => {
      if (!isMounted.current) {
        return { doramas: [], total: 0, isComplete: false };
      }

      const result = await getDoramas((newDoramas, totalCount) => {
        if (!signal.aborted && isMounted.current) {
          setAllDoramas(newDoramas);
          setTotal(totalCount);
          setDisplayedDoramas(newDoramas);
          setIsInitialLoading(false);
        }
      }, signal);

      return result;
    },
    staleTime: Infinity, // Mantém os dados em cache indefinidamente
    gcTime: Infinity, // Mantém o cache indefinidamente
    refetchOnMount: false, // Não refetch ao montar
    refetchOnWindowFocus: false, // Não refetch ao focar na janela
    refetchOnReconnect: false, // Não refetch ao reconectar
  });

  // Efeito para carregar mais doramas quando o usuário rolar até o final
  useEffect(() => {
    if (inView && !isInitialLoading && displayedDoramas.length < allDoramas.length && isMounted.current) {
      const nextBatch = allDoramas.slice(
        displayedDoramas.length,
        displayedDoramas.length + 20
      );
      setDisplayedDoramas(prev => [...prev, ...nextBatch]);
    }
  }, [inView, allDoramas, displayedDoramas, isInitialLoading]);

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
        hasMore={displayedDoramas.length < allDoramas.length}
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
          hasInitialized.current = false;
          queryClient.removeQueries({ queryKey: ['doramas'] });
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

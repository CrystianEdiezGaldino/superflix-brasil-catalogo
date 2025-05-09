
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import MediaView from "@/components/media/MediaView";
import { MediaItem, Movie } from "@/types/movie";
import { 
  fetchPopularMovies, 
  fetchTopRatedMovies, 
  fetchTrendingMovies, 
  fetchRecentMovies,
  searchMedia 
} from "@/services/tmdbApi";

const Movies = () => {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Buscar filmes iniciais
  const { data: initialMovies, isLoading: isLoadingInitial } = useQuery({
    queryKey: ["popularMovies", 1],
    queryFn: () => fetchPopularMovies(1),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Buscar filmes em tendência
  const { data: trendingMovies, isLoading: isLoadingTrending } = useQuery({
    queryKey: ["trendingMovies"],
    queryFn: () => fetchTrendingMovies(),
    staleTime: 1000 * 60 * 5,
  });

  // Buscar filmes mais bem avaliados
  const { data: topRatedMovies, isLoading: isLoadingTopRated } = useQuery({
    queryKey: ["topRatedMovies"],
    queryFn: () => fetchTopRatedMovies(),
    staleTime: 1000 * 60 * 5,
  });

  // Buscar filmes recentes
  const { data: recentMovies, isLoading: isLoadingRecent } = useQuery({
    queryKey: ["recentMovies"],
    queryFn: () => fetchRecentMovies(),
    staleTime: 1000 * 60 * 5,
  });

  // Definir filmes iniciais quando carregados
  useEffect(() => {
    if (initialMovies) {
      setMovies(initialMovies);
    }
  }, [initialMovies]);

  // Função de busca
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      if (initialMovies) setMovies(initialMovies);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchMedia(query);
      const movieResults = results.filter((item) => item.media_type === "movie") as Movie[];
      setMovies(movieResults);
      setPage(1);
      setHasMore(movieResults.length >= 20);
    } catch (error) {
      console.error("Erro na pesquisa:", error);
      toast.error("Ocorreu um erro durante a pesquisa.");
    } finally {
      setIsSearching(false);
    }
  };

  // Aplicar filtros
  const applyFilters = useCallback((movieList: MediaItem[]) => {
    let filteredMovies = [...movieList];

    if (yearFilter && yearFilter !== "all") {
      const year = parseInt(yearFilter);
      filteredMovies = filteredMovies.filter((movie) => {
        const releaseYear = 'release_date' in movie && movie.release_date 
          ? new Date(movie.release_date).getFullYear() 
          : 0;
        return releaseYear === year;
      });
    }

    if (ratingFilter && ratingFilter !== "all") {
      const rating = parseFloat(ratingFilter);
      filteredMovies = filteredMovies.filter((movie) => {
        return movie.vote_average >= rating;
      });
    }

    return filteredMovies;
  }, [yearFilter, ratingFilter]);

  // Aplicar filtros quando mudarem
  useEffect(() => {
    if (!initialMovies || isSearching) return;
    
    setIsFiltering(true);
    const filtered = applyFilters(initialMovies);
    setMovies(filtered);
    setIsFiltering(false);
  }, [yearFilter, ratingFilter, initialMovies, applyFilters, isSearching]);

  // Carregar mais filmes
  const loadMoreMovies = async () => {
    if (isSearching || isFiltering || !hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const newMovies = await fetchPopularMovies(nextPage);
      
      if (newMovies.length === 0) {
        setHasMore(false);
        return;
      }
      
      setMovies((prevMovies) => [...prevMovies, ...newMovies]);
      setPage(nextPage);
    } catch (error) {
      console.error("Erro ao carregar mais filmes:", error);
      toast.error("Erro ao carregar mais filmes.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Resetar filtros
  const resetFilters = () => {
    setYearFilter("all");
    setRatingFilter("all");
    if (initialMovies) setMovies(initialMovies);
  };

  return (
    <MediaView
      title="Filmes Dublados em Português"
      type="movie"
      mediaItems={movies}
      trendingItems={trendingMovies}
      topRatedItems={topRatedMovies}
      recentItems={recentMovies}
      searchQuery={searchQuery}
      yearFilter={yearFilter}
      ratingFilter={ratingFilter}
      isLoading={isLoadingInitial}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      isFiltering={isFiltering}
      isSearching={isSearching}
      page={page}
      onSearch={handleSearch}
      onYearFilterChange={setYearFilter}
      onRatingFilterChange={setRatingFilter}
      onLoadMore={loadMoreMovies}
      onResetFilters={resetFilters}
    />
  );
};

export default Movies;

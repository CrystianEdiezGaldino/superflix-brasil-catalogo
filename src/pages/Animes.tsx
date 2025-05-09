
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import MediaView from "@/components/media/MediaView";
import { MediaItem, Series } from "@/types/movie";
import { 
  fetchAnime, 
  fetchTopRatedAnime, 
  fetchSpecificAnimeRecommendations, 
  searchMedia 
} from "@/services/tmdbApi";

const Animes = () => {
  const [animes, setAnimes] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [itemsPerLoad] = useState(24);
  
  // Buscar animes populares
  const { data: popularAnimes, isLoading: loadingPopular } = useQuery({
    queryKey: ["popularAnime", page],
    queryFn: () => fetchAnime(page, itemsPerLoad),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Buscar animes mais bem avaliados
  const { data: topRatedAnimes, isLoading: loadingTopRated } = useQuery({
    queryKey: ["topRatedAnime"],
    queryFn: fetchTopRatedAnime
  });

  // Buscar recomendações específicas
  const { data: specificRecommendations, isLoading: loadingSpecific } = useQuery({
    queryKey: ["specificAnimeRecommendations"],
    queryFn: fetchSpecificAnimeRecommendations
  });

  // Definir animes iniciais quando carregados
  useEffect(() => {
    if (popularAnimes && page === 1) {
      setAnimes(popularAnimes);
    } else if (popularAnimes && page > 1) {
      setAnimes(prev => [...prev, ...popularAnimes]);
    }
  }, [popularAnimes, page]);

  // Função de busca
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      if (popularAnimes) setAnimes(popularAnimes);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchMedia(query);
      const animeResults = results.filter((item) => 
        item.media_type === "tv" && 
        (item.name?.toLowerCase().includes("anime") || 
        item.name?.match(/\bjapanese\b/i) || 
        item.name?.match(/\banime\b/i))
      ) as Series[];
      
      setAnimes(animeResults);
      setPage(1);
      setHasMore(animeResults.length >= itemsPerLoad);
    } catch (error) {
      console.error("Erro na pesquisa:", error);
      toast.error("Ocorreu um erro durante a pesquisa.");
    } finally {
      setIsSearching(false);
    }
  };

  // Aplicar filtros
  const applyFilters = useCallback((animeList: MediaItem[]) => {
    let filteredAnimes = [...animeList];

    if (yearFilter && yearFilter !== "all") {
      const year = parseInt(yearFilter);
      filteredAnimes = filteredAnimes.filter((anime) => {
        const releaseYear = 'first_air_date' in anime && anime.first_air_date 
          ? new Date(anime.first_air_date).getFullYear() 
          : 0;
        return releaseYear === year;
      });
    }

    if (ratingFilter && ratingFilter !== "all") {
      const rating = parseFloat(ratingFilter);
      filteredAnimes = filteredAnimes.filter((anime) => {
        return anime.vote_average >= rating;
      });
    }

    return filteredAnimes;
  }, [yearFilter, ratingFilter]);

  // Aplicar filtros quando mudarem
  useEffect(() => {
    if (!popularAnimes || isSearching) return;
    
    setIsFiltering(true);
    const filtered = applyFilters(popularAnimes);
    setAnimes(filtered);
    setIsFiltering(false);
  }, [yearFilter, ratingFilter, popularAnimes, applyFilters, isSearching]);

  // Carregar mais animes
  const loadMoreAnimes = async () => {
    if (isSearching || isFiltering || !hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    setIsLoadingMore(false);
  };

  // Resetar filtros
  const resetFilters = () => {
    setYearFilter("all");
    setRatingFilter("all");
    if (popularAnimes) setAnimes(popularAnimes);
  };

  return (
    <MediaView
      title="Animes"
      type="anime"
      mediaItems={animes}
      topRatedItems={topRatedAnimes}
      popularItems={specificRecommendations}
      searchQuery={searchQuery}
      yearFilter={yearFilter}
      ratingFilter={ratingFilter}
      isLoading={loadingPopular}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      isFiltering={isFiltering}
      isSearching={isSearching}
      page={page}
      onSearch={handleSearch}
      onYearFilterChange={setYearFilter}
      onRatingFilterChange={setRatingFilter}
      onLoadMore={loadMoreAnimes}
      onResetFilters={resetFilters}
    />
  );
};

export default Animes;

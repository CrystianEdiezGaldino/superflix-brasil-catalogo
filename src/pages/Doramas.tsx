
import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import MediaCard from "@/components/MediaCard";
import { Series } from "@/types/movie";
import { fetchKoreanDramas, fetchPopularDoramas, fetchTopRatedDoramas, searchMedia } from "@/services/tmdbApi";
import { Search, Filter } from "lucide-react";

const Doramas = () => {
  const [doramas, setDoramas] = useState<Series[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const observer = useRef<IntersectionObserver>();
  const loadingRef = useRef<HTMLDivElement>(null);

  // Fetch initial doramas
  const { data: initialDoramas, isLoading: isLoadingInitial } = useQuery({
    queryKey: ["koreanDramas", 1],
    queryFn: () => fetchKoreanDramas(1),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch popular doramas
  const { data: popularDoramas = [], isLoading: isLoadingPopular } = useQuery({
    queryKey: ["popularDoramas"],
    queryFn: () => fetchPopularDoramas(6),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch top rated doramas
  const { data: topRatedDoramas = [], isLoading: isLoadingTopRated } = useQuery({
    queryKey: ["topRatedDoramas"],
    queryFn: () => fetchTopRatedDoramas(6),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Digite algo para pesquisar");
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchMedia(searchQuery);
      // Filter for Korean dramas - in a real app, we'd have better criteria
      const doramaResults = results.filter((item) => 
        item.media_type === "tv" && 
        item.original_language === "ko"
      ) as Series[];
      
      setDoramas(doramaResults);
      setPage(1);
      setHasMore(doramaResults.length >= 20);
    } catch (error) {
      console.error("Erro na pesquisa:", error);
      toast.error("Ocorreu um erro durante a pesquisa.");
    } finally {
      setIsSearching(false);
    }
  };

  const applyFilters = useCallback((doramaList: Series[]) => {
    let filtered = [...doramaList];

    if (yearFilter && yearFilter !== "all") {
      const year = parseInt(yearFilter);
      filtered = filtered.filter((dorama) => {
        const releaseYear = dorama.first_air_date 
          ? new Date(dorama.first_air_date).getFullYear() 
          : 0;
        return releaseYear === year;
      });
    }

    // Additional filtering could be added here for genres, etc.

    return filtered;
  }, [yearFilter]);

  // Set initial doramas when they load
  useEffect(() => {
    if (initialDoramas) {
      setDoramas(initialDoramas);
    }
  }, [initialDoramas]);

  // Load more doramas when scrolling to the bottom
  const loadMoreDoramas = async () => {
    if (isSearching || isFiltering || !hasMore) return;
    
    try {
      const nextPage = page + 1;
      const newDoramas = await fetchKoreanDramas(nextPage);
      
      if (newDoramas.length === 0) {
        setHasMore(false);
        return;
      }
      
      setDoramas((prevDoramas) => [...prevDoramas, ...newDoramas]);
      setPage(nextPage);
    } catch (error) {
      console.error("Erro ao carregar mais doramas:", error);
      toast.error("Erro ao carregar mais doramas.");
    }
  };

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    if (isSearching || isFiltering) return;

    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreDoramas();
      }
    }, options);

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, isSearching, isFiltering, page]);

  // Apply filters when they change
  useEffect(() => {
    if (!initialDoramas) return;
    
    setIsFiltering(true);
    const filtered = applyFilters(initialDoramas);
    setDoramas(filtered);
    setIsFiltering(false);
  }, [yearFilter, initialDoramas, applyFilters]);

  // Generate year options for filter
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let year = currentYear; year >= 2010; year--) {
      years.push(year);
    }
    
    return years;
  };

  // Years for the filter
  const yearOptions = generateYearOptions();
  
  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={handleSearch} />
      
      <div className="pt-24 pb-10 px-4 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Doramas Coreanos</h1>
        
        {/* Search and Filter Section */}
        <div className="bg-black/40 p-6 rounded-lg mb-8 backdrop-blur-sm border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-1 gap-2">
              <Input 
                type="text" 
                placeholder="Pesquisar doramas..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white"
              />
              <Button 
                onClick={handleSearch} 
                disabled={isSearching}
                className="bg-netflix-red hover:bg-red-700"
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  <Search size={18} />
                )}
                <span className="ml-2 hidden md:inline">Pesquisar</span>
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-[120px] bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="all">Todos os anos</SelectItem>
                  <ScrollArea className="h-[200px]">
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
              
              <Select value={genreFilter} onValueChange={setGenreFilter}>
                <SelectTrigger className="w-[150px] bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="romance">Romance</SelectItem>
                  <SelectItem value="comedy">Comédia</SelectItem>
                  <SelectItem value="drama">Drama</SelectItem>
                  <SelectItem value="action">Ação</SelectItem>
                  <SelectItem value="thriller">Thriller</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="border-gray-700 text-white flex gap-2">
                <Filter size={18} />
                <span className="hidden md:inline">Filtros</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Featured Doramas - Top Rated */}
        {(!isLoadingTopRated && topRatedDoramas.length > 0) && (
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Doramas Mais Bem Avaliados</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {topRatedDoramas.map((dorama) => (
                <div key={dorama.id} className="animate-fade-in">
                  <MediaCard media={dorama} />
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Popular Doramas */}
        {(!isLoadingPopular && popularDoramas.length > 0) && (
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Doramas Populares</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {popularDoramas.map((dorama) => (
                <div key={dorama.id} className="animate-fade-in">
                  <MediaCard media={dorama} />
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* All Doramas Grid */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Todos os Doramas</h2>
          
          {isLoadingInitial ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : doramas.length === 0 ? (
            <Card className="bg-black/40 border-gray-800">
              <CardContent className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-400 text-lg">Nenhum dorama encontrado</p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setYearFilter("all");
                    setGenreFilter("all");
                    if (initialDoramas) setDoramas(initialDoramas);
                  }}
                  variant="link" 
                  className="text-netflix-red mt-2"
                >
                  Limpar filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {doramas.map((dorama) => (
                  <div key={dorama.id} className="dorama-grid-item">
                    <MediaCard media={dorama} />
                  </div>
                ))}
              </div>
              
              {/* Loading indicator for infinite scroll */}
              {hasMore && !isSearching && !isFiltering && (
                <div ref={loadingRef} className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Doramas;

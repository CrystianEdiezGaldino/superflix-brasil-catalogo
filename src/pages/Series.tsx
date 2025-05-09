
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
import { fetchPopularSeries, searchMedia } from "@/services/tmdbApi";
import { Search, Filter, ChevronDown } from "lucide-react";

const SeriesPage = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [itemsPerLoad] = useState(24); // Increased items per load
  const observer = useRef<IntersectionObserver>();
  const loadingRef = useRef<HTMLDivElement>(null);

  const { data: initialSeries, isLoading: isLoadingInitial } = useQuery({
    queryKey: ["popularSeries", 1],
    queryFn: () => fetchPopularSeries(1, itemsPerLoad),
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
      const seriesResults = results.filter((item) => item.media_type === "tv") as Series[];
      setSeries(seriesResults);
      setPage(1);
      setHasMore(seriesResults.length >= itemsPerLoad);
    } catch (error) {
      console.error("Erro na pesquisa:", error);
      toast.error("Ocorreu um erro durante a pesquisa.");
    } finally {
      setIsSearching(false);
    }
  };

  const applyFilters = useCallback((seriesList: Series[]) => {
    let filteredSeries = [...seriesList];

    if (yearFilter && yearFilter !== "all") {
      const year = parseInt(yearFilter);
      filteredSeries = filteredSeries.filter((series) => {
        const releaseYear = series.first_air_date 
          ? new Date(series.first_air_date).getFullYear() 
          : 0;
        return releaseYear === year;
      });
    }

    if (ratingFilter && ratingFilter !== "all") {
      const rating = parseFloat(ratingFilter);
      filteredSeries = filteredSeries.filter((series) => {
        return series.vote_average >= rating;
      });
    }

    return filteredSeries;
  }, [yearFilter, ratingFilter]);

  // Set initial series when they load
  useEffect(() => {
    if (initialSeries) {
      setSeries(initialSeries);
    }
  }, [initialSeries]);

  // Load more series when scrolling to the bottom or clicking "load more"
  const loadMoreSeries = async () => {
    if (isSearching || isFiltering || !hasMore) return;
    
    try {
      const nextPage = page + 1;
      const newSeries = await fetchPopularSeries(nextPage, itemsPerLoad);
      
      if (newSeries.length === 0) {
        setHasMore(false);
        return;
      }
      
      setSeries((prevSeries) => [...prevSeries, ...newSeries]);
      setPage(nextPage);
    } catch (error) {
      console.error("Erro ao carregar mais séries:", error);
      toast.error("Erro ao carregar mais séries.");
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
        loadMoreSeries();
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
    if (!initialSeries) return;
    
    setIsFiltering(true);
    const filtered = applyFilters(initialSeries);
    setSeries(filtered);
    setIsFiltering(false);
  }, [yearFilter, ratingFilter, initialSeries, applyFilters]);

  // Generate year options for filter
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let year = currentYear; year >= 1950; year--) {
      years.push(year);
    }
    
    return years;
  };

  // Years for the filter
  const yearOptions = generateYearOptions();
  
  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={() => {}} />
      
      <div className="pt-24 pb-10 px-4 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Séries Dubladas em Português</h1>
        
        {/* Search and Filter Section */}
        <div className="bg-black/40 p-6 rounded-lg mb-8 backdrop-blur-sm border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-1 gap-2">
              <Input 
                type="text" 
                placeholder="Pesquisar séries..." 
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
              
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-[120px] bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Avaliação" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="8">8+ ⭐</SelectItem>
                  <SelectItem value="7">7+ ⭐</SelectItem>
                  <SelectItem value="6">6+ ⭐</SelectItem>
                  <SelectItem value="5">5+ ⭐</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="border-gray-700 text-white flex gap-2">
                <Filter size={18} />
                <span className="hidden md:inline">Filtros</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Series Grid */}
        {isLoadingInitial ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : series.length === 0 ? (
          <Card className="bg-black/40 border-gray-800">
            <CardContent className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-400 text-lg">Nenhuma série encontrada</p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setYearFilter("all");
                  setRatingFilter("all");
                  if (initialSeries) setSeries(initialSeries);
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
              {series.map((series, index) => (
                <div 
                  key={series.id} 
                  className="movie-grid-item"
                  style={{ '--delay': index } as React.CSSProperties}
                >
                  <MediaCard media={series} />
                </div>
              ))}
            </div>
            
            {/* Loading indicator for infinite scroll */}
            {hasMore && !isSearching && !isFiltering && (
              <div ref={loadingRef} className="flex justify-center py-8">
                <Button 
                  onClick={loadMoreSeries}
                  className="bg-netflix-red hover:bg-red-700 text-white"
                >
                  Carregar Mais Séries
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesPage;

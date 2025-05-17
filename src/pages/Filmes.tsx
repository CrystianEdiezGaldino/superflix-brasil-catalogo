import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchMoviesByCategory,
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchPopularMovies,
  fetchRecentMovies
} from "@/services/tmdb/movies";
import { MediaItem } from "@/types/movie";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import MediaSection from "@/components/MediaSection";
import Navbar from "@/components/Navbar";

const CATEGORIES = {
  "": "Todos os Filmes",
  "lancamentos": "Lançamentos",
  "acao": "Ação",
  "comedia": "Comédia",
  "drama": "Drama",
  "terror": "Terror",
  "romance": "Romance",
  "aventura": "Aventura",
  "animacao": "Animação",
  "documentario": "Documentário",
  "ficcao": "Ficção Científica",
  "fantasia": "Fantasia",
  "suspense": "Suspense",
  "biografia": "Biografia",
  "historia": "História"
} as const;

const Filmes = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [allMovies, setAllMovies] = useState<MediaItem[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Busca filmes em destaque
  const { data: trendingMovies = [], isLoading: isLoadingTrending } = useQuery({
    queryKey: ["movies", "trending"],
    queryFn: () => fetchTrendingMovies(),
    enabled: !selectedCategory,
  });

  // Busca filmes mais bem avaliados
  const { data: topRatedMovies = [], isLoading: isLoadingTopRated } = useQuery({
    queryKey: ["movies", "topRated"],
    queryFn: () => fetchTopRatedMovies(),
    enabled: !selectedCategory,
  });

  // Busca filmes populares
  const { data: popularMovies = [], isLoading: isLoadingPopular } = useQuery({
    queryKey: ["movies", "popular"],
    queryFn: () => fetchPopularMovies(),
    enabled: !selectedCategory,
  });

  // Busca filmes recentes
  const { data: recentMovies = [], isLoading: isLoadingRecent } = useQuery({
    queryKey: ["movies", "recent"],
    queryFn: () => fetchRecentMovies(),
    enabled: !selectedCategory,
  });

  // Busca filmes por categoria
  const { data: categoryMovies = [], isLoading: isLoadingCategory } = useQuery({
    queryKey: ["movies", "category", selectedCategory, page],
    queryFn: async () => {
      if (!selectedCategory) return [];
      return fetchMoviesByCategory(selectedCategory, page);
    },
    enabled: !!selectedCategory,
  });

  // Atualiza a lista de filmes quando novos dados chegam
  useEffect(() => {
    if (selectedCategory && categoryMovies.length > 0) {
      if (page === 1) {
        setAllMovies(categoryMovies);
      } else {
        setAllMovies(prev => [...prev, ...categoryMovies]);
      }
    }
  }, [categoryMovies, selectedCategory, page]);

  // Configura o Intersection Observer para detectar quando chegar ao final da página
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoadingCategory) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && categoryMovies.length > 0) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoadingCategory, categoryMovies]);

  const handleMediaClick = (media: MediaItem) => {
    navigate(`/filme/${media.id}`);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
    setAllMovies([]);
    toast.success(`Mostrando ${CATEGORIES[category as keyof typeof CATEGORIES]}`);
  };

  const isLoading = isLoadingCategory || 
    isLoadingTrending || isLoadingTopRated || isLoadingPopular || isLoadingRecent;

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Filmes</h1>
          
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORIES).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Seções de conteúdo */}
        {!selectedCategory && (
          <>
            {/* Seção de tendências */}
            {trendingMovies.length > 0 && (
              <MediaSection 
                title="Tendências em Filmes"
                medias={trendingMovies}
                onMediaClick={handleMediaClick}
              />
            )}
            
            {/* Seção dos mais bem avaliados */}
            {topRatedMovies.length > 0 && (
              <MediaSection 
                title="Filmes Mais Bem Avaliados"
                medias={topRatedMovies}
                onMediaClick={handleMediaClick}
              />
            )}
            
            {/* Seção dos mais populares */}
            {popularMovies.length > 0 && (
              <MediaSection 
                title="Filmes Populares"
                medias={popularMovies}
                onMediaClick={handleMediaClick}
              />
            )}
            
            {/* Seção de conteúdo recente */}
            {recentMovies.length > 0 && (
              <MediaSection 
                title="Filmes Recentes"
                medias={recentMovies}
                onMediaClick={handleMediaClick}
              />
            )}
          </>
        )}

        {/* Seção de categoria selecionada */}
        {selectedCategory && allMovies.length > 0 && (
          <MediaSection 
            title={CATEGORIES[selectedCategory as keyof typeof CATEGORIES]}
            medias={allMovies}
            onMediaClick={handleMediaClick}
          />
        )}

        {/* Elemento de carregamento e referência para infinite scroll */}
        <div ref={loadingRef} className="flex justify-center items-center py-8">
          {isLoading && (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red"></div>
          )}
        </div>
        
        {/* Elemento observado para infinite scroll */}
        {selectedCategory && !isLoading && (
          <div ref={lastElementRef} style={{ height: "20px" }} />
        )}
      </div>
    </div>
  );
};

export default Filmes; 
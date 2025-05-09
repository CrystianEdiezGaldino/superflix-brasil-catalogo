
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import MediaSection from "@/components/MediaSection";
import { fetchPopularMovies, fetchPopularSeries, searchMedia } from "@/services/tmdbApi";
import { MediaItem } from "@/types/movie";

const Index = () => {
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [featuredMedia, setFeaturedMedia] = useState<MediaItem | undefined>(undefined);

  // Buscar filmes populares brasileiros
  const moviesQuery = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => fetchPopularMovies(),
  });

  // Buscar séries populares brasileiras
  const seriesQuery = useQuery({
    queryKey: ["popularSeries"],
    queryFn: () => fetchPopularSeries(),
  });

  // Selecionar um item aleatório para destaque
  useEffect(() => {
    const allMedia = [
      ...(moviesQuery.data || []),
      ...(seriesQuery.data || [])
    ];
    
    if (allMedia.length > 0) {
      const randomIndex = Math.floor(Math.random() * allMedia.length);
      setFeaturedMedia(allMedia[randomIndex]);
    }
  }, [moviesQuery.data, seriesQuery.data]);

  // Função de pesquisa
  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const results = await searchMedia(query);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast.info("Nenhum resultado encontrado para sua pesquisa.");
      }
    } catch (error) {
      console.error("Erro na pesquisa:", error);
      toast.error("Ocorreu um erro durante a pesquisa.");
    }
    setIsSearching(false);
  };

  // Limpar pesquisa ao retornar para a página inicial
  useEffect(() => {
    return () => {
      setSearchResults([]);
      setIsSearching(false);
    };
  }, []);

  // Estado de carregamento
  const isLoading = moviesQuery.isPending || seriesQuery.isPending;

  // Estado de erro
  const hasError = moviesQuery.isError || seriesQuery.isError;
  
  if (hasError) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Erro ao carregar conteúdo</h1>
          <p className="text-gray-400">Tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={handleSearch} />
      
      {/* Banner principal */}
      <Banner media={featuredMedia} />
      
      <main className="container max-w-full pt-4 pb-20">
        {isSearching ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <h1 className="text-2xl font-bold text-white mb-4 px-4">Resultados da Pesquisa</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4">
              {searchResults.map((media) => (
                <div key={`${media.media_type}-${media.id}`}>
                  <MediaSection title="" medias={[media]} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Seções de conteúdo */}
            <MediaSection 
              title="Filmes Brasileiros em Alta" 
              medias={moviesQuery.data || []} 
            />
            <MediaSection 
              title="Séries Brasileiras Populares" 
              medias={seriesQuery.data || []} 
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;

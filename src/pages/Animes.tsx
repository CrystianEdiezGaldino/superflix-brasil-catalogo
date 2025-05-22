import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { MediaItem, getMediaTitle, isAnime, isSeries } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { 
  Search, 
  Filter, 
  Loader2, 
  Star, 
  Calendar, 
  Play, 
  Info, 
  Sparkles, 
  TrendingUp,
  Award,
  Clock,
  Eye,
  EyeOff,
  Lock
} from "lucide-react";
import MediaCard from "@/components/media/MediaCard";
import AdultContentSection from "@/components/anime/AdultContentSection";

const ITEMS_PER_LOAD = 20;

const Animes: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const loadingRef = useRef<HTMLDivElement | null>(null);
  
  // Estados principais
  const [allAnimes, setAllAnimes] = useState<MediaItem[]>([]);
  const [displayedAnimes, setDisplayedAnimes] = useState<MediaItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // Estados de seções
  const [featured, setFeatured] = useState<MediaItem[]>([]);
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [topRated, setTopRated] = useState<MediaItem[]>([]);
  const [recent, setRecent] = useState<MediaItem[]>([]);
  const [seasonal, setSeasonal] = useState<MediaItem[]>([]);
  
  // Estados para conteúdo adulto
  const [showAdultContent, setShowAdultContent] = useState(false);
  const [adultPassword, setAdultPassword] = useState("");
  const [isAdultVerified, setIsAdultVerified] = useState(false);
  const [adultAnimes, setAdultAnimes] = useState<MediaItem[]>([]);

  // Validação de anime
  const isValidAnime = (anime: any): boolean => {
    return (
      anime &&
      anime.id &&
      anime.poster_path &&
      anime.backdrop_path &&
      (anime.title || anime.name) &&
      anime.overview &&
      anime.vote_average !== undefined
    );
  };

  // Buscar animes do TMDB
  const { data: tmdbData, isLoading: isTmdbLoading } = useQuery({
    queryKey: ['tmdb-animes', currentPage],
    queryFn: async () => {
      try {
        const promises = [
          // Animes populares
          fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=16&language=pt-BR&page=${currentPage}`),
          // Animes mais bem avaliados
          fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=16&language=pt-BR&page=${currentPage}`),
          // Animes no ar
          fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=16&language=pt-BR&page=${currentPage}`),
          // Descobrir animes
          fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=16&language=pt-BR&page=${currentPage}&sort_by=popularity.desc`)
        ];

        const responses = await Promise.all(promises);
        const data = await Promise.all(responses.map(r => r.json()));

        const filterValidAnimes = (results: any[]) => {
          return results.filter((anime: any) => {
            const isJapanese = anime.origin_country?.includes('JP') || 
                             anime.original_language === 'ja' ||
                             anime.name?.toLowerCase().includes('anime');
            return isJapanese && isValidAnime(anime);
          });
        };

        const popularAnimes = filterValidAnimes(data[0].results);
        const topRatedAnimes = filterValidAnimes(data[1].results);
        const onTheAirAnimes = filterValidAnimes(data[2].results);
        const discoverAnimes = filterValidAnimes(data[3].results);

        // Combinar e remover duplicatas
        const allResults = [...popularAnimes, ...topRatedAnimes, ...onTheAirAnimes, ...discoverAnimes];
        const uniqueAnimes = allResults.filter((anime, index, self) => 
          index === self.findIndex((a) => a.id === anime.id)
        );

        return {
          animes: uniqueAnimes,
          totalPages: Math.max(data[0].total_pages, data[1].total_pages, data[2].total_pages, data[3].total_pages)
        };
      } catch (error) {
        console.error('Erro ao buscar animes:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });

  // Buscar lista do Superflix
  const { data: superflixData } = useQuery({
    queryKey: ['superflix-animes'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/animes');
        if (!response.ok) throw new Error('Erro ao buscar animes do Superflix');
        
        const text = await response.text();
        const ids = text.split('<br>').map(id => id.trim()).filter(Boolean);
        return ids;
      } catch (error) {
        console.error('Erro ao buscar animes do Superflix:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 10
  });

  // Combinar dados e organizar seções
  useEffect(() => {
    if (tmdbData && superflixData) {
      const combinedAnimes = [...tmdbData.animes, ...superflixData]
        .filter((anime, index, self) => index === self.findIndex(a => a.id === anime.id))
        .filter(isValidAnime);

      if (currentPage === 1) {
        setAllAnimes(combinedAnimes);
        setupSections(combinedAnimes);
        
        // Mostrar primeiros 20 animes
        setDisplayedAnimes(combinedAnimes.slice(0, ITEMS_PER_LOAD));
        setHasMore(combinedAnimes.length > ITEMS_PER_LOAD);
      } else {
        setAllAnimes(prev => {
          const newAnimes = [...prev, ...combinedAnimes];
          const unique = newAnimes.filter((anime, index, self) => 
            index === self.findIndex(a => a.id === anime.id)
          );
          return unique;
        });
      }
    }
  }, [tmdbData, superflixData, currentPage]);

  // Configurar seções
  const setupSections = (animes: MediaItem[]) => {
    // Separar conteúdo adulto
    const regularAnimes = animes.filter(anime => !isAdultContent(anime));
    const adultAnimes = animes.filter(anime => isAdultContent(anime));
    
    setAdultAnimes(adultAnimes);
    
    // Animes em destaque (alta popularidade e avaliação)
    const featuredAnimes = regularAnimes
      .filter(anime => anime.vote_average >= 7.5 && anime.popularity > 50)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 6);
    setFeatured(featuredAnimes);

    // Trending (por popularidade)
    const trendingAnimes = regularAnimes
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10);
    setTrending(trendingAnimes);

    // Mais bem avaliados
    const topRatedAnimes = regularAnimes
      .filter(anime => anime.vote_average > 0)
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, 10);
    setTopRated(topRatedAnimes);

    // Lançamentos recentes
    const recentAnimes = regularAnimes
      .filter(anime => anime.first_air_date || anime.release_date)
      .sort((a, b) => {
        const dateA = new Date(a.first_air_date || a.release_date);
        const dateB = new Date(b.first_air_date || b.release_date);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 10);
    setRecent(recentAnimes);

    // Animes da temporada atual
    const currentYear = new Date().getFullYear();
    const seasonalAnimes = regularAnimes
      .filter(anime => {
        const airDate = anime.first_air_date || anime.release_date;
        return airDate && new Date(airDate).getFullYear() === currentYear;
      })
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10);
    setSeasonal(seasonalAnimes);
  };

  // Verificar se é conteúdo adulto
  const isAdultContent = (anime: MediaItem): boolean => {
    const adultGenres = ['hentai', 'ecchi', 'adult'];
    // Só considera o campo 'name' e 'adult' se for anime
    const name = isAnime(anime) ? (anime.name || anime.title || '') : (anime.title || '');
    const overview = (anime.overview || '').toLowerCase();

    return (isAnime(anime) && anime.adult) ||
           anime.genres?.some(genre => adultGenres.some(ag => genre.name.toLowerCase().includes(ag))) ||
           adultGenres.some(ag => name.toLowerCase().includes(ag) || overview.includes(ag));
  };

  // Carregar mais animes
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    
    try {
      const startIndex = displayedAnimes.length;
      const endIndex = startIndex + ITEMS_PER_LOAD;
      const newAnimes = allAnimes.slice(startIndex, endIndex);
      
      if (newAnimes.length > 0) {
        setDisplayedAnimes(prev => [...prev, ...newAnimes]);
        setHasMore(endIndex < allAnimes.length);
      } else {
        // Tentar carregar mais da API
        if (currentPage < (tmdbData?.totalPages || 1)) {
          setCurrentPage(prev => prev + 1);
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar mais animes:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Implementar scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && hasMore) {
          handleLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [loadingRef, isLoadingMore, hasMore]);

  // Verificar senha do conteúdo adulto
  const handleAdultPasswordSubmit = () => {
    if (adultPassword === user?.email || adultPassword === "admin123") {
      setIsAdultVerified(true);
      setShowAdultContent(true);
    } else {
      alert("Senha incorreta!");
    }
    setAdultPassword("");
  };

  // Navegar para anime
  const handleMediaClick = (anime: MediaItem) => {
    navigate(`/anime/${anime.id}`);
  };

  // Loading
  if (isTmdbLoading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <Skeleton className="h-[50vh] w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <div className="space-y-8">
              <Skeleton className="h-8 w-64" />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(12)].map((_, i) => (
                  <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section Aprimorado */}
        <div className="relative h-[50vh] mb-12 rounded-xl overflow-hidden group">
          {featured[0] && (
            <>
              <img
                src={`https://image.tmdb.org/t/p/original${featured[0].backdrop_path}`}
                alt={getMediaTitle(featured[0])}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3 lg:w-1/2">
                <Badge className="bg-netflix-red text-white mb-4 px-3 py-1">Em Destaque</Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  {getMediaTitle(featured[0])}
                </h1>
                <div className="flex items-center gap-4 text-gray-200 mb-4">
                  <span className="flex items-center">
                    <Star className="text-yellow-400 mr-1" size={16} />
                    {featured[0].vote_average.toFixed(1)}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="text-gray-400 mr-1" size={16} />
                    {new Date(featured[0].first_air_date || featured[0].release_date).getFullYear()}
                  </span>
                  {(isSeries(featured[0]) || isAnime(featured[0])) && featured[0].number_of_seasons && (
                    <span className="flex items-center">
                      <Sparkles className="text-gray-400 mr-1" size={16} />
                      {featured[0].number_of_seasons} {featured[0].number_of_seasons > 1 ? 'Temporadas' : 'Temporada'}
                    </span>
                  )}
                </div>
                <p className="text-gray-200 mb-6 line-clamp-3 text-sm md:text-base">{featured[0].overview}</p>
                <div className="flex gap-4">
                  <Button 
                    onClick={() => handleMediaClick(featured[0])}
                    className="bg-netflix-red hover:bg-netflix-red/90 text-white px-8 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Play size={18} /> Assistir Agora
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleMediaClick(featured[0])}
                    className="border-white/50 text-white hover:bg-white/10 px-6 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Info size={18} /> Mais Detalhes
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tabs de Navegação */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="bg-gray-800/50 p-1 rounded-lg w-full md:w-auto">
            <TabsTrigger value="all" className="data-[state=active]:bg-netflix-red data-[state=active]:text-white">
              Todos os Animes
            </TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-netflix-red data-[state=active]:text-white">
              Lançamentos
            </TabsTrigger>
            <TabsTrigger value="popular" className="data-[state=active]:bg-netflix-red data-[state=active]:text-white">
              Populares
            </TabsTrigger>
            <TabsTrigger value="rated" className="data-[state=active]:bg-netflix-red data-[state=active]:text-white">
              Bem Avaliados
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Seções de Animes com Carrossel */}
        <div className="space-y-16">
          {/* Lançamentos do Ano */}
          {seasonal.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Calendar className="mr-2 text-netflix-red" size={24} />
                  Lançamentos {new Date().getFullYear()}
                </h2>
              
              </div>
              
              <Carousel className="w-full">
                <CarouselContent className="-ml-4">
                  {seasonal.slice(0, 12).map((anime, index) => (
                    <CarouselItem key={`${anime.id}-${index}`} className="pl-4 md:basis-1/3 lg:basis-1/6">
                      <div className="relative group overflow-hidden rounded-lg">
                        <MediaCard
                          media={anime}
                          onClick={() => handleMediaClick(anime)}
                          index={index}
                          isFocused={false}
                          onFocus={() => {}}
                          className="transform transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <h3 className="text-white font-bold truncate">{getMediaTitle(anime)}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-200 mt-1">
                            <span className="flex items-center">
                              <Star className="text-yellow-400 mr-1" size={12} />
                              {anime.vote_average.toFixed(1)}
                            </span>
                            <span>{new Date(anime.first_air_date || anime.release_date).getFullYear()}</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="mt-2 bg-netflix-red hover:bg-netflix-red/90 text-white"
                            onClick={() => handleMediaClick(anime)}
                          >
                            <Play size={14} className="mr-1" /> Assistir
                          </Button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-black/50 text-white hover:bg-black/80" />
                <CarouselNext className="right-2 bg-black/50 text-white hover:bg-black/80" />
              </Carousel>
            </section>
          )}

          {/* Em Alta */}
          {trending.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <TrendingUp className="mr-2 text-netflix-red" size={24} />
                  Em Alta
                </h2>
               
              </div>
              
              <Carousel className="w-full">
                <CarouselContent className="-ml-4">
                  {trending.slice(0, 12).map((anime, index) => (
                    <CarouselItem key={`${anime.id}-${index}`} className="pl-4 md:basis-1/3 lg:basis-1/6">
                      <div className="relative group overflow-hidden rounded-lg">
                        <MediaCard
                          media={anime}
                          onClick={() => handleMediaClick(anime)}
                          index={index}
                          isFocused={false}
                          onFocus={() => {}}
                          className="transform transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <h3 className="text-white font-bold truncate">{getMediaTitle(anime)}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-200 mt-1">
                            <span className="flex items-center">
                              <Star className="text-yellow-400 mr-1" size={12} />
                              {anime.vote_average.toFixed(1)}
                            </span>
                            <span>{new Date(anime.first_air_date || anime.release_date).getFullYear()}</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="mt-2 bg-netflix-red hover:bg-netflix-red/90 text-white"
                            onClick={() => handleMediaClick(anime)}
                          >
                            <Play size={14} className="mr-1" /> Assistir
                          </Button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-black/50 text-white hover:bg-black/80" />
                <CarouselNext className="right-2 bg-black/50 text-white hover:bg-black/80" />
              </Carousel>
            </section>
          )}

          {/* Mais Bem Avaliados */}
          {topRated.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Award className="mr-2 text-netflix-red" size={24} />
                  Mais Bem Avaliados
                </h2>
               
              </div>
              
              <Carousel className="w-full">
                <CarouselContent className="-ml-4">
                  {topRated.slice(0, 12).map((anime, index) => (
                    <CarouselItem key={`${anime.id}-${index}`} className="pl-4 md:basis-1/3 lg:basis-1/6">
                      <div className="relative group overflow-hidden rounded-lg">
                        <MediaCard
                          media={anime}
                          onClick={() => handleMediaClick(anime)}
                          index={index}
                          isFocused={false}
                          onFocus={() => {}}
                          className="transform transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <h3 className="text-white font-bold truncate">{getMediaTitle(anime)}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-200 mt-1">
                            <span className="flex items-center">
                              <Star className="text-yellow-400 mr-1" size={12} />
                              {anime.vote_average.toFixed(1)}
                            </span>
                            <span>{new Date(anime.first_air_date || anime.release_date).getFullYear()}</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="mt-2 bg-netflix-red hover:bg-netflix-red/90 text-white"
                            onClick={() => handleMediaClick(anime)}
                          >
                            <Play size={14} className="mr-1" /> Assistir
                          </Button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-black/50 text-white hover:bg-black/80" />
                <CarouselNext className="right-2 bg-black/50 text-white hover:bg-black/80" />
              </Carousel>
            </section>
          )}

          {/* Conteúdo Adulto com Design Melhorado */}
          {adultAnimes.length > 0 && (
            <section className="bg-gray-800/30 p-6 rounded-xl backdrop-blur-sm">
              <AdultContentSection
                title="Conteúdo Adulto"
                animes={adultAnimes.slice(0, 12)}
                onMediaClick={handleMediaClick}
              />
            </section>
          )}

          {/* Lista Completa com Scroll Infinito */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Sparkles className="mr-2 text-netflix-red" size={24} />
                Todos os Animes
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {displayedAnimes.map((anime, index) => (
                <div
                  key={`${anime.id}-${index}`}
                  className="relative group overflow-hidden rounded-lg"
                  ref={index === displayedAnimes.length - 1 ? loadingRef : null}
                >
                  <MediaCard
                    media={anime}
                    onClick={() => handleMediaClick(anime)}
                    index={index}
                    isFocused={false}
                    onFocus={() => {}}
                    className="transform transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold truncate">{getMediaTitle(anime)}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-200 mt-1">
                      <span className="flex items-center">
                        <Star className="text-yellow-400 mr-1" size={12} />
                        {anime.vote_average.toFixed(1)}
                      </span>
                      <span>{new Date(anime.first_air_date || anime.release_date).getFullYear()}</span>
                    </div>
                    <Button
                      size="sm"
                      className="mt-2 bg-netflix-red hover:bg-netflix-red/90 text-white"
                      onClick={() => handleMediaClick(anime)}
                    >
                      <Play size={14} className="mr-1" /> Assistir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {isLoadingMore && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 text-netflix-red animate-spin" />
                <span className="ml-2 text-white">Carregando mais animes...</span>
              </div>
            )}
            
            {!hasMore && displayedAnimes.length > 0 && (
              <div className="text-center py-8 text-gray-400">
                Você chegou ao fim da lista de animes disponíveis.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Animes;

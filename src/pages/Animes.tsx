
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { MediaItem, getMediaTitle, isAnime, isSeries } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import FeaturedAnimeCarousel from "@/components/anime/FeaturedAnimeCarousel";
import AnimeSection from "@/components/anime/AnimeSection";
import AllAnimesSection from "@/components/anime/AllAnimesSection";
import AdultContentSection from "@/components/anime/AdultContentSection";
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
} from "lucide-react";

const ITEMS_PER_LOAD = 20;

const Animes: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const loadingRef = useRef<HTMLDivElement | null>(null);
  
  // Main states
  const [allAnimes, setAllAnimes] = useState<MediaItem[]>([]);
  const [displayedAnimes, setDisplayedAnimes] = useState<MediaItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // Section states
  const [featured, setFeatured] = useState<MediaItem[]>([]);
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [topRated, setTopRated] = useState<MediaItem[]>([]);
  const [recent, setRecent] = useState<MediaItem[]>([]);
  
  // Adult content states
  const [showAdultContent, setShowAdultContent] = useState(false);
  const [adultPassword, setAdultPassword] = useState("");
  const [isAdultVerified, setIsAdultVerified] = useState(false);
  const [adultAnimes, setAdultAnimes] = useState<MediaItem[]>([]);

  // Anime validation
  const isValidAnime = (anime: any): boolean => {
    return (
      anime &&
      anime.id &&
      (anime.poster_path || anime.backdrop_path) &&
      (anime.title || anime.name) &&
      anime.overview 
    );
  };

  // Fetch animes from TMDB
  const { data: tmdbData, isLoading: isTmdbLoading } = useQuery({
    queryKey: ['tmdb-animes', currentPage],
    queryFn: async () => {
      try {
        const promises = [
          // Popular animes
          fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=16&language=pt-BR&page=${currentPage}`),
          // Top rated animes
          fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=16&language=pt-BR&page=${currentPage}`),
          // On the air animes
          fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=16&language=pt-BR&page=${currentPage}`),
          // Discover animes
          fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=16&language=pt-BR&page=${currentPage}&sort_by=popularity.desc`)
        ];

        const responses = await Promise.all(promises);
        const data = await Promise.all(responses.map(r => r.json()));

        const filterValidAnimes = (results: any[]) => {
          if (!results || !Array.isArray(results)) return [];
          
          return results.filter((anime: any) => {
            const isJapanese = anime.origin_country?.includes('JP') || 
                             anime.original_language === 'ja' ||
                             anime.name?.toLowerCase().includes('anime');
            return isJapanese && isValidAnime(anime);
          });
        };

        const popularAnimes = filterValidAnimes(data[0]?.results || []);
        const topRatedAnimes = filterValidAnimes(data[1]?.results || []);
        const onTheAirAnimes = filterValidAnimes(data[2]?.results || []);
        const discoverAnimes = filterValidAnimes(data[3]?.results || []);

        // Combine and remove duplicates
        const allResults = [...popularAnimes, ...topRatedAnimes, ...onTheAirAnimes, ...discoverAnimes];
        const uniqueAnimes = allResults.filter((anime, index, self) => 
          index === self.findIndex((a) => a.id === anime.id)
        );

        return {
          animes: uniqueAnimes,
          totalPages: Math.max(
            data[0]?.total_pages || 1, 
            data[1]?.total_pages || 1, 
            data[2]?.total_pages || 1, 
            data[3]?.total_pages || 1
          )
        };
      } catch (error) {
        console.error('Error fetching animes:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });

  // Fetch Superflix list
  const { data: superflixData } = useQuery({
    queryKey: ['superflix-animes'],
    queryFn: async () => {
      try {
        // Updated domain from superflixapi.fyi to superflixapi.ist
        const response = await fetch('/api/animes');
        if (!response.ok) throw new Error('Error fetching animes from Superflix');
        
        const text = await response.text();
        if (!text) return [];
        
        const ids = text.split('<br>').map(id => id.trim()).filter(Boolean);
        return ids;
      } catch (error) {
        console.error('Error fetching animes from Superflix:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 10
  });

  // Combine data and organize sections
  useEffect(() => {
    if (tmdbData?.animes) {
      const combinedAnimes = [...(tmdbData.animes || [])];
      
      if (Array.isArray(superflixData) && superflixData.length > 0) {
        // Here we would need to fetch details for each ID, but for now we'll just use the TMDB data
        console.log("Superflix anime IDs:", superflixData.length);
      }
      
      const validAnimes = combinedAnimes.filter(isValidAnime);

      if (currentPage === 1) {
        setAllAnimes(validAnimes);
        setupSections(validAnimes);
        
        // Show first batch of animes
        setDisplayedAnimes(validAnimes.slice(0, ITEMS_PER_LOAD));
        setHasMore(validAnimes.length > ITEMS_PER_LOAD);
      } else {
        setAllAnimes(prev => {
          const newAnimes = [...prev, ...validAnimes];
          const unique = newAnimes.filter((anime, index, self) => 
            index === self.findIndex(a => a.id === anime.id)
          );
          return unique;
        });
      }
    }
  }, [tmdbData, superflixData, currentPage]);

  // Setup sections
  const setupSections = (animes: MediaItem[]) => {
    if (!animes || !Array.isArray(animes)) {
      console.error("Invalid animes data for setupSections:", animes);
      return;
    }
    
    // Separate adult content
    const regularAnimes = animes.filter(anime => !isAdultContent(anime));
    const adultAnimes = animes.filter(anime => isAdultContent(anime));
    
    setAdultAnimes(adultAnimes);
    
    // Featured animes (high popularity and rating)
    const featuredAnimes = regularAnimes
      .filter(anime => anime.vote_average >= 7.5 && (anime.popularity || 0) > 50)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 6);
    setFeatured(featuredAnimes);

    // Trending (by popularity)
    const trendingAnimes = regularAnimes
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 10);
    setTrending(trendingAnimes);

    // Top rated
    const topRatedAnimes = regularAnimes
      .filter(anime => anime.vote_average > 0)
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, 30);
    setTopRated(topRatedAnimes);

    // Recent releases
    const recentAnimes = regularAnimes
      .filter(anime => anime.first_air_date || anime.release_date)
      .sort((a, b) => {
        const dateA = new Date(a.first_air_date || a.release_date || "");
        const dateB = new Date(b.first_air_date || b.release_date || "");
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 10);
    setRecent(recentAnimes);
  };

  // Check if content is adult
  const isAdultContent = (anime: MediaItem): boolean => {
    const adultGenres = ['hentai', 'ecchi', 'adult'];
    // Only consider the 'name' and 'adult' fields if it's anime
    const name = isAnime(anime) ? (anime.name || anime.title || '') : (anime.title || '');
    const overview = (anime.overview || '').toLowerCase();

    return (isAnime(anime) && anime.adult) ||
           anime.genres?.some(genre => adultGenres.some(ag => genre.name.toLowerCase().includes(ag))) ||
           adultGenres.some(ag => name.toLowerCase().includes(ag) || overview.includes(ag));
  };

  // Load more animes
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
        // Try to load more from API
        if (currentPage < (tmdbData?.totalPages || 1)) {
          setCurrentPage(prev => prev + 1);
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error loading more animes:', error);
      toast.error("Erro ao carregar mais animes");
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Implement infinite scroll
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

  // Verify adult content password
  const handleAdultPasswordSubmit = () => {
    if (adultPassword === user?.email || adultPassword === "admin123") {
      setIsAdultVerified(true);
      setShowAdultContent(true);
      toast.success("Conteúdo adulto desbloqueado");
    } else {
      toast.error("Senha incorreta!");
    }
    setAdultPassword("");
  };

  // Navigate to anime
  const handleMediaClick = (anime: MediaItem) => {
    navigate(`/anime/${anime.id}`);
  };

  // Loading state
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
        {/* Featured Anime Carousel */}
        <FeaturedAnimeCarousel 
          animes={featured} 
          onAnimeClick={handleMediaClick} 
        />

        {/* Content Tabs */}
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

        {/* Anime Sections */}
        <div className="space-y-16">
          {/* Recent Releases */}
          <AnimeSection
            title="Lançamentos em Exibição"
            animes={recent}
            icon={<Calendar className="mr-2 text-netflix-red" size={24} />}
            onMediaClick={handleMediaClick}
          />

          {/* Trending Animes */}
          <AnimeSection
            title="Em Alta"
            animes={trending}
            icon={<TrendingUp className="mr-2 text-netflix-red" size={24} />}
            onMediaClick={handleMediaClick}
          />

          {/* Top Rated Animes */}
          <AnimeSection
            title="Melhores Animes"
            animes={topRated}
            icon={<Award className="mr-2 text-netflix-red" size={24} />}
            onMediaClick={handleMediaClick}
          />

          {/* Adult Content Section */}
          {adultAnimes.length > 0 && (
            <AdultContentSection
              title="Conteúdo Adulto"
              animes={adultAnimes.slice(0, 12)}
              onMediaClick={handleMediaClick}
            />
          )}

          {/* All Animes with Infinite Scroll */}
          <AllAnimesSection
            animes={displayedAnimes}
            isLoading={isTmdbLoading}
            isFetchingMore={isLoadingMore}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onMediaClick={handleMediaClick}
            loadingRef={loadingRef}
          />
        </div>
      </div>
    </div>
  );
};

export default Animes;

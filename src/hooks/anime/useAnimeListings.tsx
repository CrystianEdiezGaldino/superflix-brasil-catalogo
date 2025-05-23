
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MediaItem } from '@/types/movie';

interface UseAnimeListingsProps {
  initialPage?: number;
  itemsPerPage?: number;
}

interface AnimeSections {
  featured: MediaItem[];
  trending: MediaItem[];
  topRated: MediaItem[];
  recent: MediaItem[];
  adult: MediaItem[];
}

export const useAnimeListings = ({ 
  initialPage = 1,
  itemsPerPage = 20
}: UseAnimeListingsProps = {}) => {
  // Main states
  const [allAnimes, setAllAnimes] = useState<MediaItem[]>([]);
  const [displayedAnimes, setDisplayedAnimes] = useState<MediaItem[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sections, setSections] = useState<AnimeSections>({
    featured: [],
    trending: [],
    topRated: [],
    recent: [],
    adult: []
  });
  
  const loadingRef = useRef<HTMLDivElement>(null);

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

  // Check if content is adult
  const isAdultContent = (anime: MediaItem): boolean => {
    const adultGenres = ['hentai', 'ecchi', 'adult'];
    const name = anime.name || anime.title || '';
    const overview = (anime.overview || '').toLowerCase();

    return (anime.adult) ||
           anime.genres?.some(genre => adultGenres.some(ag => genre.name.toLowerCase().includes(ag))) ||
           adultGenres.some(ag => name.toLowerCase().includes(ag) || overview.includes(ag));
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

  // Setup sections
  const setupSections = (animes: MediaItem[]) => {
    if (!animes || !Array.isArray(animes)) {
      console.error("Invalid animes data for setupSections:", animes);
      return;
    }
    
    // Separate adult content
    const regularAnimes = animes.filter(anime => !isAdultContent(anime));
    const adultAnimes = animes.filter(anime => isAdultContent(anime));
    
    // Featured animes (high popularity and rating)
    const featuredAnimes = regularAnimes
      .filter(anime => anime.vote_average >= 7.5 && (anime.popularity || 0) > 50)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 6);
    
    // Trending (by popularity)
    const trendingAnimes = regularAnimes
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 10);
    
    // Top rated
    const topRatedAnimes = regularAnimes
      .filter(anime => anime.vote_average > 0)
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, 30);
    
    // Recent releases
    const recentAnimes = regularAnimes
      .filter(anime => anime.first_air_date || anime.release_date)
      .sort((a, b) => {
        const dateA = new Date(a.first_air_date || a.release_date || "");
        const dateB = new Date(b.first_air_date || b.release_date || "");
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 10);

    setSections({
      featured: featuredAnimes,
      trending: trendingAnimes,
      topRated: topRatedAnimes,
      recent: recentAnimes,
      adult: adultAnimes
    });
  };

  // Combine data and organize sections
  useEffect(() => {
    if (tmdbData?.animes) {
      const combinedAnimes = [...(tmdbData.animes || [])];
      
      if (Array.isArray(superflixData) && superflixData.length > 0) {
        console.log("Superflix anime IDs:", superflixData.length);
      }
      
      const validAnimes = combinedAnimes.filter(isValidAnime);

      if (currentPage === 1) {
        setAllAnimes(validAnimes);
        setupSections(validAnimes);
        
        // Show first batch of animes
        setDisplayedAnimes(validAnimes.slice(0, itemsPerPage));
        setHasMore(validAnimes.length > itemsPerPage);
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
  }, [tmdbData, superflixData, currentPage, itemsPerPage]);

  // Load more animes
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    
    try {
      const startIndex = displayedAnimes.length;
      const endIndex = startIndex + itemsPerPage;
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
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    allAnimes,
    displayedAnimes,
    sections,
    isLoading: isTmdbLoading && currentPage === 1,
    isLoadingMore,
    hasMore,
    loadingRef,
    handleLoadMore
  };
};

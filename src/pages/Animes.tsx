import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAnimeGenres, fetchPopularAnimes } from "@/services/tmdbApi";
import { MediaItem } from "@/types/movie";
import Navbar from "@/components/Navbar";
import MediaSection from "@/components/MediaSection";
import AnimeBanner from "@/components/home/AnimeBanner";
import LoadingState from "@/components/home/LoadingState";
import ErrorState from "@/components/home/ErrorState";
import SubscriptionUpsell from "@/components/home/SubscriptionUpsell";
import AnimeFilters from "@/components/animes/AnimeFilters";
import SearchBar from "@/components/ui/SearchBar";

const Animes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popularity.desc");
  const [popularAnimes, setPopularAnimes] = useState<MediaItem[]>([]);
  const [recentAnimes, setRecentAnimes] = useState<MediaItem[]>([]);
  const [topRatedAnimes, setTopRatedAnimes] = useState<MediaItem[]>([]);
  const [airingAnimes, setAiringAnimes] = useState<MediaItem[]>([]);
  const [featuredAnime, setFeaturedAnime] = useState<MediaItem | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { data: genres = [], isLoading: loadingGenres, error: errorGenres } = useQuery({
    queryKey: ["animeGenres"],
    queryFn: () => fetchAnimeGenres(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const years = ["2020", "2021", "2022", "2023", "2024"];
  const sortOptions = [
    { value: "popularity.desc", label: "Popularidade" },
    { value: "vote_average.desc", label: "Melhor Avaliação" },
    { value: "first_air_date.desc", label: "Data de Lançamento" },
  ];

  const {
    data: animesData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["animes", selectedGenres, selectedYear, sortBy, searchQuery, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      selectedGenres.forEach((genre) => params.append("with_genres", genre.toString()));
      if (selectedYear) params.append("year", selectedYear);
      params.append("sort_by", sortBy);
      params.append("page", page.toString());
      if (searchQuery) params.append("query", searchQuery);

      const response = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=6c99755ca38454177149899c6e640919&with_networks=213&${params.toString()}`
      );
      const data = await response.json();
      return data.results;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: popularData } = useQuery({
    queryKey: ["popularAnimes"],
    queryFn: () => fetchPopularAnimes(),
    onSuccess: (data) => {
      setPopularAnimes(data || []);
      if (data && data.length > 0) {
        setFeaturedAnime(data[0]);
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  useEffect(() => {
    if (animesData) {
      setSearchResults(animesData);
    }
  }, [animesData]);

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedYear("");
    setSortBy("popularity.desc");
  };

  const loadMoreAnimes = async (type: string) => {
    setLoadingMore(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${type}?api_key=6c99755ca38454177149899c6e640919&with_networks=213&page=${
          page + 1
        }`
      );
      const data = await response.json();
      const newAnimes = data.results;

      if (newAnimes && newAnimes.length > 0) {
        switch (type) {
          case "popular":
            setPopularAnimes((prev) => [...prev, ...newAnimes]);
            break;
          case "recent":
            setRecentAnimes((prev) => [...prev, ...newAnimes]);
            break;
          case "top_rated":
            setTopRatedAnimes((prev) => [...prev, ...newAnimes]);
            break;
          case "airing":
            setAiringAnimes((prev) => [...prev, ...newAnimes]);
            break;
          default:
            break;
        }
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more animes:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const loadMoreSearchResults = async () => {
    setLoadingMore(true);
    try {
      const params = new URLSearchParams();
      selectedGenres.forEach((genre) => params.append("with_genres", genre.toString()));
      if (selectedYear) params.append("year", selectedYear);
      params.append("sort_by", sortBy);
      params.append("page", (page + 1).toString());
      if (searchQuery) params.append("query", searchQuery);

      const response = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=6c99755ca38454177149899c6e640919&with_networks=213&${params.toString()}`
      );
      const data = await response.json();
      const newResults = data.results;

      if (newResults && newResults.length > 0) {
        setSearchResults((prev) => [...prev, ...newResults]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more search results:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setIsSearching(!!searchQuery);
    setPage(1);
    setHasMore(true);
    refetch();
  }, [searchQuery, selectedGenres, selectedYear, sortBy, refetch]);

  useEffect(() => {
    async function getAiringToday() {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/airing_today?api_key=6c99755ca38454177149899c6e640919&with_networks=213`
      );
      const data = await response.json();
      setAiringAnimes(data.results);
    }

    async function getTopRated() {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/top_rated?api_key=6c99755ca38454177149899c6e640919&with_networks=213`
      );
      const data = await response.json();
      setTopRatedAnimes(data.results);
    }

    async function getRecent() {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/on_the_air?api_key=6c99755ca38454177149899c6e640919&with_networks=213`
      );
      const data = await response.json();
      setRecentAnimes(data.results);
    }

    getAiringToday();
    getTopRated();
    getRecent();
  }, []);

  const handleMediaClick = useCallback(
    (media: MediaItem) => {
      navigate(`/anime/${media.id}`);
    },
    [navigate]
  );

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="bg-netflix-background min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Filters */}
          <div className="w-full lg:w-1/4 xl:w-1/5">
            <AnimeFilters 
              genres={genres}
              selectedGenres={selectedGenres}
              onGenreToggle={toggleGenre}
              onClearFilters={clearFilters}
              years={years}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              sortOptions={sortOptions}
              selectedSort={sortBy}
              onSortChange={setSortBy}
            />
          </div>
          
          {/* Main Content */}
          <div className="w-full lg:w-3/4 xl:w-4/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Animes</h1>
              <SearchBar 
                placeholder="Buscar animes..." 
                onSearch={setSearchQuery}
                className="w-full md:w-80"
              />
            </div>
            
            {isSearching && (
              <div className="text-center py-10">
                <div className="spinner"></div>
                <p className="text-white mt-4">Buscando animes...</p>
              </div>
            )}
            
            {searchQuery && searchResults.length === 0 && !isSearching && (
              <div className="text-center py-10">
                <p className="text-white text-xl">Nenhum anime encontrado para "{searchQuery}"</p>
              </div>
            )}
            
            {searchQuery && searchResults.length > 0 && (
              <MediaSection 
                title={`Resultados para "${searchQuery}"`}
                medias={searchResults}
                sectionId="search-results"
                showLoadMore={true}
                onLoadMore={async () => {
                  await loadMoreSearchResults();
                }}
                onMediaClick={handleMediaClick}
                sectionIndex={0}
              />
            )}
            
            {!searchQuery && (
              <>
                {featuredAnime && (
                  <div className="mb-10">
                    <AnimeBanner anime={featuredAnime} onClick={() => handleMediaClick(featuredAnime)} />
                  </div>
                )}
                
                <MediaSection 
                  title="Animes Populares"
                  medias={popularAnimes}
                  sectionId="popular-animes"
                  showLoadMore={true}
                  onLoadMore={async () => {
                    await loadMoreAnimes('popular');
                  }}
                  onMediaClick={handleMediaClick}
                  sectionIndex={1}
                />
                
                <MediaSection 
                  title="Animes Recentes"
                  medias={recentAnimes}
                  sectionId="recent-animes"
                  showLoadMore={true}
                  onLoadMore={async () => {
                    await loadMoreAnimes('recent');
                  }}
                  onMediaClick={handleMediaClick}
                  sectionIndex={2}
                />
                
                <MediaSection 
                  title="Animes Mais Avaliados"
                  medias={topRatedAnimes}
                  sectionId="top-rated-animes"
                  showLoadMore={true}
                  onLoadMore={async () => {
                    await loadMoreAnimes('top_rated');
                  }}
                  onMediaClick={handleMediaClick}
                  sectionIndex={3}
                />
                
                <MediaSection 
                  title="Animes Em Exibição"
                  medias={airingAnimes}
                  sectionId="airing-animes"
                  showLoadMore={true}
                  onLoadMore={async () => {
                    await loadMoreAnimes('airing');
                  }}
                  onMediaClick={handleMediaClick}
                  sectionIndex={4}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Animes;

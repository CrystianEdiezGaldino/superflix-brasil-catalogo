import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaPlay, FaStar, FaFilm, FaTv, FaDragon } from "react-icons/fa";
import { fetchKidsContent } from "@/services/tmdbApi";
import { MediaItem } from "@/types/movie";
import Navbar from "@/components/Navbar";
import MediaCard from "@/components/MediaCard";
import SearchBar from "@/components/ui/SearchBar";
import MediaView from "@/components/home/MediaView";
import LoadingState from "@/components/home/LoadingState";
import LargeSubscriptionUpsell from "@/components/home/LargeSubscriptionUpsell";
import { useAuth } from "@/contexts/AuthContext";

const Kids = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [hasMoreSearchResults, setHasMoreSearchResults] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const { user, loading, hasAccess, hasTrialAccess } = useAuth();
  
  const {
    data: kidsContent = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["kidsContent"],
    queryFn: () => fetchKidsContent(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  
  const categories = ["Aventura", "Comédia", "Drama", "Musical", "Animação"];
  
  const featuredKidsShow = kidsContent[0];
  const kidsMovies = kidsContent.filter(media => media.media_type === 'movie');
  const kidsSeries = kidsContent.filter(media => media.media_type === 'tv');
  const kidsAnimations = kidsContent.filter(media => media.genre_ids?.includes(16));
  
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const filterByCategory = (media: MediaItem) => {
    if (selectedCategories.length === 0) return true;
    
    const mediaCategories = media.genres?.map(genre => genre.name) || [];
    return selectedCategories.some(category => mediaCategories.includes(category));
  };
  
  const handleMediaClick = useCallback((media: MediaItem) => {
    if (media.media_type === "movie") {
      navigate(`/filme/${media.id}`);
    } else if (media.media_type === "tv") {
      navigate(`/serie/${media.id}`);
    } else {
      console.log("Tipo de mídia não suportado:", media.media_type);
    }
  }, [navigate]);
  
  const searchKidsContent = async (query: string) => {
    setIsSearching(true);
    setCurrentSection('search');
    setIsLoadingMore(true);
    
    try {
      const filtered = kidsContent.filter(media =>
        media.title?.toLowerCase().includes(query.toLowerCase()) ||
        media.name?.toLowerCase().includes(query.toLowerCase())
      );
      
      const categoryFiltered = filtered.filter(filterByCategory);
      
      setSearchResults(categoryFiltered);
      setHasMoreSearchResults(false);
    } catch (error) {
      console.error("Erro ao buscar conteúdo infantil:", error);
      setSearchResults([]);
      setHasMoreSearchResults(false);
    } finally {
      setIsSearching(false);
      setIsLoadingMore(false);
    }
  };
  
  const loadMoreSearchResults = async () => {
    setIsLoadingMore(true);
    setCurrentSection('search');
    
    try {
      // Simulate loading more results
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setHasMoreSearchResults(false);
    } catch (error) {
      console.error("Erro ao carregar mais resultados:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  useEffect(() => {
    if (searchQuery) {
      searchKidsContent(searchQuery);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, kidsContent, selectedCategories]);
  
  // Redirection handling
  if (loading) {
    return <LoadingState />;
  }

  if (!hasAccess && !hasTrialAccess) {
    return <LargeSubscriptionUpsell />;
  }

  return (
    <div className="bg-gradient-to-b from-blue-900 to-indigo-900 min-h-screen pb-10">
      <Navbar />
      
      <div className="relative">
        {/* Hero Banner */}
        <div 
          className="h-[50vh] md:h-[60vh] bg-cover bg-center relative"
          style={{
            backgroundImage: featuredKidsShow?.backdrop_path 
              ? `url(https://image.tmdb.org/t/p/original${featuredKidsShow.backdrop_path})`
              : 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-2/3 text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              {featuredKidsShow?.title || featuredKidsShow?.name || 'Conteúdo Infantil'}
            </h1>
            <p className="text-lg mb-6 line-clamp-3 max-w-2xl drop-shadow-md">
              {featuredKidsShow?.overview || 'Diversão garantida para toda a família!'}
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => featuredKidsShow && handleMediaClick(featuredKidsShow)}
                className="bg-white text-indigo-800 font-bold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-opacity-90 transition-all"
              >
                <FaPlay /> Assistir
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 -mt-12 relative z-10">
        {/* Search and Filter Section */}
        <div className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-2xl mb-10 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="flex-grow">
              <SearchBar 
                placeholder="Pesquisar conteúdo infantil" 
                onSearch={setSearchQuery}
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        {isSearching ? (
          <div className="flex justify-center items-center h-64">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {searchQuery && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Resultados para "{searchQuery}"
                </h2>
                {searchResults.length > 0 ? (
                  <MediaView
                    title={`Resultados para "${searchQuery}"`}
                    type="movie"
                    mediaItems={searchResults}
                    trendingItems={searchResults}
                    topRatedItems={[]}
                    recentItems={[]}
                    onMediaClick={handleMediaClick}
                    onLoadMoreTrending={loadMoreSearchResults}
                    onLoadMoreTopRated={() => {}}
                    onLoadMoreRecent={() => {}}
                    hasMoreTrending={hasMoreSearchResults}
                    hasMoreTopRated={false}
                    hasMoreRecent={false}
                    sectionLoading={isLoadingMore && currentSection === 'search'}
                    focusedSection={0}
                    focusedItem={0}
                  >
                    {searchResults.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-white text-lg">
                          Nenhum resultado encontrado para "{searchQuery}"
                        </p>
                      </div>
                    )}
                  </MediaView>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-white text-lg">
                      Nenhum resultado encontrado para "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {!searchQuery && (
              <>
                <div className="mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 inline-flex items-center">
                    <FaStar className="mr-2 text-yellow-400" /> Recomendados para Crianças
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {kidsContent.slice(0, 10).map((media) => (
                      <MediaCard 
                        key={media.id}
                        media={media}
                        onClick={() => handleMediaClick(media)}
                        aspectRatio="portrait"
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 inline-flex items-center">
                    <FaFilm className="mr-2 text-pink-400" /> Filmes Infantis
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {kidsMovies.slice(0, 10).map((media) => (
                      <MediaCard 
                        key={media.id}
                        media={media}
                        onClick={() => handleMediaClick(media)}
                        aspectRatio="portrait"
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 inline-flex items-center">
                    <FaTv className="mr-2 text-cyan-400" /> Séries Infantis
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {kidsSeries.slice(0, 10).map((media) => (
                      <MediaCard 
                        key={media.id}
                        media={media}
                        onClick={() => handleMediaClick(media)}
                        aspectRatio="portrait"
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 inline-flex items-center">
                    <FaDragon className="mr-2 text-purple-400" /> Animações
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {kidsAnimations.slice(0, 10).map((media) => (
                      <MediaCard 
                        key={media.id}
                        media={media}
                        onClick={() => handleMediaClick(media)}
                        aspectRatio="portrait"
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Kids;

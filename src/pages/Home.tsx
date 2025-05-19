import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTrending } from "../services/tmdb/trending";
import { fetchTopRated } from "../services/tmdb/topRated";
import { fetchUpcoming } from "../services/tmdb/upcoming";
import MediaView from "../components/media/MediaView";
import type { MediaItem } from "../types/movie";
import { useMovies } from "../hooks/movies/useMovies";
import { useAuth } from "@/contexts/AuthContext";
import UnauthenticatedState from "@/components/home/UnauthenticatedState";
import LoadingState from "@/components/home/LoadingState";

const Home = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [focusedSection, setFocusedSection] = useState(0);
  const [focusedItem, setFocusedItem] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialLoadComplete = useRef(false);

  const {
    movies,
    loadMoreMovies,
    isLoadingMore,
    hasMore
  } = useMovies();

  const { data: trending = [], isLoading: isLoadingTrending } = useQuery({
    queryKey: ["trending"],
    queryFn: () => fetchTrending()
  });

  const { data: topRated = [], isLoading: isLoadingTopRated } = useQuery({
    queryKey: ["topRated"],
    queryFn: () => fetchTopRated()
  });

  const { data: upcoming = [], isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ["upcoming"],
    queryFn: () => fetchUpcoming()
  });

  // Only show loading state on initial load
  const isLoading = (isLoadingTrending || isLoadingTopRated || isLoadingUpcoming) && !initialLoadComplete.current;
  
  useEffect(() => {
    if (!isLoading && !initialLoadComplete.current) {
      initialLoadComplete.current = true;
    }
  }, [isLoading]);

  // Show appropriate state based on authentication
  if (authLoading) {
    return <LoadingState />;
  }

  if (!user && !authLoading) {
    return <UnauthenticatedState />;
  }

  const sections = [
    { key: 'trending', items: trending, title: 'Tendências' },
    { key: 'topRated', items: topRated, title: 'Mais Bem Avaliados' },
    { key: 'upcoming', items: upcoming, title: 'Em Breve' }
  ];

  const handleMediaClick = (media: MediaItem) => {
    if (!media.id) return;
    if (media.media_type === 'tv') {
      if (media.original_language === 'ko') {
        navigate(`/dorama/${media.id}`);
      } else {
        navigate(`/serie/${media.id}`);
      }
    } else {
      navigate(`/filme/${media.id}`);
    }
  };

  const handleLoadMore = () => {
    loadMoreMovies();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (focusedSection < sections.length - 1) {
            setFocusedSection(prev => prev + 1);
            setFocusedItem(0);
            // Scroll para a próxima seção
            const nextSection = document.querySelector(`[data-section="${focusedSection + 1}"]`);
            if (nextSection) {
              nextSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          if (focusedSection > 0) {
            setFocusedSection(prev => prev - 1);
            setFocusedItem(0);
            // Scroll para a seção anterior
            const prevSection = document.querySelector(`[data-section="${focusedSection - 1}"]`);
            if (prevSection) {
              prevSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
          break;

        case "ArrowRight":
          e.preventDefault();
          const currentSection = sections[focusedSection];
          if (currentSection && focusedItem < currentSection.items.length - 1) {
            setFocusedItem(prev => prev + 1);
            // Scroll horizontal para o próximo item
            const nextItem = document.querySelector(`[data-section="${focusedSection}"] [data-item="${focusedItem + 1}"]`);
            if (nextItem) {
              nextItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
          }
          break;

        case "ArrowLeft":
          e.preventDefault();
          if (focusedItem > 0) {
            setFocusedItem(prev => prev - 1);
            // Scroll horizontal para o item anterior
            const prevItem = document.querySelector(`[data-section="${focusedSection}"] [data-item="${focusedItem - 1}"]`);
            if (prevItem) {
              prevItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
          }
          break;

        case "Enter":
          e.preventDefault();
          const currentItem = sections[focusedSection].items[focusedItem];
          if (currentItem) {
            handleMediaClick(currentItem);
          }
          break;

        case "Backspace":
          e.preventDefault();
          window.history.back();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedSection, focusedItem, sections]);

  return (
    <div ref={containerRef} className="tv-navigation-container">
      <MediaView
        title="Bem-vindo ao SuperFlix"
        type="movie"
        mediaItems={[]}
        trendingItems={trending}
        topRatedItems={topRated}
        recentItems={upcoming}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        isFiltering={!!yearFilter || !!ratingFilter}
        isSearching={!!searchQuery}
        page={1}
        yearFilter={yearFilter}
        ratingFilter={ratingFilter}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onYearFilterChange={setYearFilter}
        onRatingFilterChange={setRatingFilter}
        onLoadMore={handleLoadMore}
        onResetFilters={() => {
          setYearFilter("");
          setRatingFilter("");
          setSearchQuery("");
        }}
        onMediaClick={handleMediaClick}
        focusedSection={focusedSection}
        focusedItem={focusedItem}
      />
    </div>
  );
};

export default Home;

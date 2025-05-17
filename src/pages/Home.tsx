import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTrending } from "../services/tmdb/trending";
import { fetchTopRated } from "../services/tmdb/topRated";
import { fetchUpcoming } from "../services/tmdb/upcoming";
import MediaView from "../components/media/MediaView";
import type { MediaItem } from "../types/movie";
import { useMovies } from "../hooks/movies/useMovies";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [focusedSection, setFocusedSection] = useState(0);
  const [focusedItem, setFocusedItem] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
          setFocusedSection(prev => Math.min(prev + 1, sections.length - 1));
          setFocusedItem(0);
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedSection(prev => Math.max(prev - 1, 0));
          setFocusedItem(0);
          break;
        case "ArrowRight":
          e.preventDefault();
          setFocusedItem(prev => Math.min(prev + 1, sections[focusedSection].items.length - 1));
          break;
        case "ArrowLeft":
          e.preventDefault();
          setFocusedItem(prev => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          const currentItem = sections[focusedSection].items[focusedItem];
          if (currentItem) handleMediaClick(currentItem);
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
        isLoading={isLoadingTrending || isLoadingTopRated || isLoadingUpcoming}
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


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MediaView from "@/components/media/MediaView";
import { useKidsContent } from "@/hooks/kids/useKidsContent";
import { Baby, Film, Tv } from "lucide-react";
import { MediaItem } from "@/types/movie";

const Kids = () => {
  const navigate = useNavigate();
  const [focusedSection, setFocusedSection] = useState(0);
  const [focusedItem, setFocusedItem] = useState(0);
  
  const {
    kidsContent,
    trendingContent,
    topRatedContent,
    recentContent,
    popularContent,
    isLoading,
    isLoadingMore,
    hasMore,
    page,
    yearFilter,
    ratingFilter,
    searchQuery,
    isSearching,
    isFiltering,
    handleSearchChange,
    handleYearFilterChange,
    handleRatingFilterChange,
    loadMore,
    resetFilters
  } = useKidsContent();

  // Handle media click to navigate to correct page
  const handleMediaClick = (media: MediaItem) => {
    if (!media || !media.id) return;
    
    if (media.media_type === 'tv') {
      if (media.original_language === 'ko') {
        navigate(`/dorama/${media.id}`);
      } else if (media.original_language === 'ja') {
        navigate(`/anime/${media.id}`);
      } else {
        navigate(`/serie/${media.id}`);
      }
    } else {
      navigate(`/filme/${media.id}`);
    }
  };

  // Navegação por controle de TV
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const sections = [
        { items: trendingContent, title: 'Tendências' },
        { items: topRatedContent, title: 'Mais Bem Avaliados' },
        { items: recentContent, title: 'Recentes' },
        { items: popularContent, title: 'Populares' }
      ];

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedSection(prev => Math.min(prev + 1, sections.length - 1));
          setFocusedItem(0);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedSection(prev => Math.max(prev - 1, 0));
          setFocusedItem(0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          const currentSection = sections[focusedSection];
          if (currentSection?.items) {
            setFocusedItem(prev => Math.min(prev + 1, currentSection.items.length - 1));
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedItem(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          const section = sections[focusedSection];
          if (section?.items?.[focusedItem]) {
            handleMediaClick(section.items[focusedItem]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedSection, focusedItem, trendingContent, topRatedContent, recentContent, popularContent]);

  return (
    <MediaView
      title="Conteúdo Infantil"
      type="movie"
      mediaItems={kidsContent}
      trendingItems={trendingContent}
      topRatedItems={topRatedContent}
      recentItems={recentContent}
      popularItems={popularContent}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      isFiltering={isFiltering}
      isSearching={isSearching}
      page={page}
      yearFilter={yearFilter}
      ratingFilter={ratingFilter}
      searchQuery={searchQuery}
      onSearch={handleSearchChange}
      onYearFilterChange={handleYearFilterChange}
      onRatingFilterChange={handleRatingFilterChange}
      onLoadMore={loadMore}
      onResetFilters={resetFilters}
      onMediaClick={handleMediaClick}
      focusedSection={focusedSection}
      focusedItem={focusedItem}
    >
      <div className="mb-8 bg-gradient-to-b from-purple-900/70 to-black/20 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Baby size={32} className="text-pink-400" />
          <h2 className="text-2xl font-bold text-white">Espaço Infantil</h2>
        </div>
        <p className="text-gray-200 mb-4">
          Um mundo de diversão e aprendizado para os pequenos! Aqui você encontra filmes de animação, 
          desenhos animados, séries infantis e muito mais, com classificação indicativa adequada para crianças.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="bg-purple-800/40 px-3 py-1 rounded-full text-sm flex items-center">
            <Film size={14} className="mr-1" />
            <span>Filmes de Animação</span>
          </div>
          <div className="bg-blue-800/40 px-3 py-1 rounded-full text-sm flex items-center">
            <Tv size={14} className="mr-1" />
            <span>Desenhos Animados</span>
          </div>
          <div className="bg-green-800/40 px-3 py-1 rounded-full text-sm flex items-center">
            <Film size={14} className="mr-1" />
            <span>Filmes Infantis</span>
          </div>
          <div className="bg-pink-800/40 px-3 py-1 rounded-full text-sm flex items-center">
            <Tv size={14} className="mr-1" />
            <span>Séries Infantis</span>
          </div>
        </div>
      </div>
    </MediaView>
  );
};

export default Kids;

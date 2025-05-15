
import { useQuery } from '@tanstack/react-query';
import MediaView from '@/components/media/MediaView';
import { Series } from '@/types/movie';
import { useState, useEffect } from 'react';
import { getSeries } from '@/services/series';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MediaCardSkeleton from '@/components/media/MediaCardSkeleton';
import { useSeries } from '@/hooks/series/useSeries';
import LoadingState from '@/components/home/LoadingState';

const SeriesPage = () => {
  const navigate = useNavigate();
  
  // Utilizar o hook useSeries para aproveitar a lógica existente
  const { 
    series, 
    trendingSeries, 
    topRatedSeries, 
    recentSeries,
    searchQuery,
    yearFilter,
    ratingFilter,
    page,
    hasMore,
    isLoadingInitial,
    isLoadingTrending,
    isLoadingTopRated,
    isLoadingRecent,
    isLoadingMore,
    isSearching,
    isFiltering,
    handleSearch,
    loadMoreSeries,
    setYearFilter,
    setRatingFilter,
    resetFilters
  } = useSeries();

  const handleMediaClick = (media: Series) => {
    if (media && media.id) {
      navigate(`/serie/${media.id}`);
    }
  };

  if (isLoadingInitial && !isSearching && !isFiltering) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <MediaView
        title="Séries"
        type="tv"
        mediaItems={series}
        trendingItems={trendingSeries}
        topRatedItems={topRatedSeries}
        recentItems={recentSeries}
        isLoading={false}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        isFiltering={isFiltering}
        isSearching={isSearching}
        page={page}
        yearFilter={yearFilter}
        ratingFilter={ratingFilter}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onYearFilterChange={setYearFilter}
        onRatingFilterChange={setRatingFilter}
        onLoadMore={loadMoreSeries}
        onResetFilters={resetFilters}
        onMediaClick={handleMediaClick}
      />
    </div>
  );
};

export default SeriesPage;

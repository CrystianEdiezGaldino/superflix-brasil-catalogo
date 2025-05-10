import { useQuery } from '@tanstack/react-query';
import { fetchSeriesDetails } from '@/services/tmdb/series';
import MediaView from '@/components/media/MediaView';
import type { Series } from '@/types/movie';
import { useState } from 'react';

const Series = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  const { data: series, isLoading } = useQuery({
    queryKey: ['series'],
    queryFn: async () => {
      const ids = [259486, 259487, 259488]; // IDs das séries
      const results = await Promise.all(
        ids.map(id => fetchSeriesDetails(id.toString(), 'pt-BR'))
      );
      return results.filter(series => 
        !['ko', 'ja', 'zh'].includes(series.original_language)
      ) as Series[];
    },
  });

  return (
    <MediaView
      title="Séries"
      type="tv"
      mediaItems={series || []}
      isLoading={isLoading}
      isLoadingMore={false}
      hasMore={false}
      isFiltering={false}
      isSearching={false}
      page={1}
      yearFilter={yearFilter}
      ratingFilter={ratingFilter}
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
      onYearFilterChange={setYearFilter}
      onRatingFilterChange={setRatingFilter}
      onLoadMore={() => {}}
      onResetFilters={() => {
        setYearFilter('');
        setRatingFilter('');
        setSearchQuery('');
      }}
    />
  );
};

export default Series;

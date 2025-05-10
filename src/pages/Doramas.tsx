import { useQuery } from '@tanstack/react-query';
import MediaView from '@/components/media/MediaView';
import { Series } from '@/types/movie';
import { useState } from 'react';
import { getDoramas } from '@/services/doramas';
import { useNavigate } from 'react-router-dom';

const Doramas = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  const { data: doramas, isLoading } = useQuery({
    queryKey: ['doramas'],
    queryFn: getDoramas,
  });

  const handleMediaClick = (media: Series) => {
    navigate(`/dorama/${media.id}`);
  };

  return (
    <MediaView
      title="Doramas"
      type="dorama"
      mediaItems={doramas || []}
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
      onMediaClick={handleMediaClick}
    />
  );
};

export default Doramas;

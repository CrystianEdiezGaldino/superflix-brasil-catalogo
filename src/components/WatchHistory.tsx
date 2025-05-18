
import { useEffect, useState } from 'react';
import { watchHistoryService, WatchHistoryItem } from '@/services/watchHistoryService';
import { useQuery } from '@tanstack/react-query';
import { fetchMediaById } from '@/services/tmdbApi';
import { MediaItem } from '@/types/movie';
import { useNavigate } from 'react-router-dom';

export function WatchHistory() {
  const { data: history, isLoading } = useQuery({
    queryKey: ['watchHistory'],
    queryFn: () => watchHistoryService.getWatchHistory(),
  });

  const [mediaDetails, setMediaDetails] = useState<MediaItem[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (!history) return;

      const details = await Promise.all(
        history.map(async (item) => {
          const details = await fetchMediaById(item.tmdb_id, item.media_type);
          if (!details) return null;
          return {
            ...details,
            media_type: item.media_type,
          } as MediaItem;
        })
      );

      setMediaDetails(details.filter((item): item is MediaItem => item !== null));
    };

    fetchMediaDetails();
  }, [history]);

  const handleMediaClick = (media: MediaItem) => {
    if (media.media_type === 'movie') {
      navigate(`/filme/${media.id}`);
    } else {
      navigate(`/serie/${media.id}`);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  if (isLoading) {
    return <div>Carregando histórico...</div>;
  }

  if (!mediaDetails.length) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Continuar Assistindo</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {mediaDetails.map((media, idx) => (
          <div key={media.id} className="w-full">
            {/* Added required props for MediaCard */}
            <MediaCard
              media={media}
              onClick={() => handleMediaClick(media)}
              index={idx}
              isFocused={focusedIndex === idx}
              onFocus={handleFocus}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

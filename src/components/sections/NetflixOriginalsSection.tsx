import { useEffect, useState } from 'react';
import { MediaItem } from '@/types/movie';
import { fetchNetflixOriginals } from '@/services/tmdb/netflixOriginals';
import { MediaCard } from '../ui/MediaCard';
import { SectionTitle } from '../ui/SectionTitle';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function NetflixOriginalsSection() {
  const [originals, setOriginals] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOriginals = async () => {
      try {
        const data = await fetchNetflixOriginals();
        setOriginals(data);
      } catch (error) {
        console.error('Error loading Netflix originals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOriginals();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="py-8">
      <SectionTitle>Originais da Netflix</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {originals.map((item) => (
          <MediaCard
            key={`${item.media_type}-${item.id}`}
            item={item}
            showType={true}
          />
        ))}
      </div>
    </section>
  );
} 
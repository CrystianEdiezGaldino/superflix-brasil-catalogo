import { useEffect, useState } from 'react';
import { MediaItem } from '@/types/movie';
import { fetchPrimeOriginals } from '@/services/tmdb/primeOriginals';
import { MediaCard } from '../ui/MediaCard';
import { SectionTitle } from '../ui/SectionTitle';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function PrimeOriginalsSection() {
  const [originals, setOriginals] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOriginals = async () => {
      try {
        const data = await fetchPrimeOriginals();
        setOriginals(data);
      } catch (error) {
        console.error('Error loading Prime Video originals:', error);
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
      <SectionTitle>Originais Prime Video</SectionTitle>
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
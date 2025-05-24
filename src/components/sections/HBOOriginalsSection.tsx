import { useEffect, useState } from 'react';
import { MediaItem } from '@/types/movie';
import { fetchHBOOriginals } from '@/services/tmdb/hboOriginals';
import { MediaCard } from '../ui/MediaCard';
import { SectionTitle } from '../ui/SectionTitle';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function HBOOriginalsSection() {
  const [originals, setOriginals] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOriginals = async () => {
      try {
        const data = await fetchHBOOriginals();
        setOriginals(data);
      } catch (error) {
        console.error('Error loading HBO Max originals:', error);
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
      <SectionTitle>Originais HBO Max</SectionTitle>
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
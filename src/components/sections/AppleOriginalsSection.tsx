
import { useEffect, useState } from 'react';
import { MediaItem } from '@/types/movie';
import { fetchAppleOriginals } from '@/services/tmdb/appleOriginals';
import MediaCard from '@/components/media/MediaCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function AppleOriginalsSection() {
  const [originals, setOriginals] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    const loadOriginals = async () => {
      try {
        const data = await fetchAppleOriginals();
        setOriginals(data);
      } catch (error) {
        console.error('Error loading Apple TV+ originals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOriginals();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (originals.length === 0) {
    return (
      <section className="py-8">
        <SectionTitle>Originais Apple TV+</SectionTitle>
        <div className="text-center py-8">
          <p className="text-gray-400">Nenhum conteúdo da Apple TV+ encontrado no momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <SectionTitle>Originais Apple TV+</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {originals.map((item, index) => (
          <MediaCard
            key={`${item.media_type}-${item.id}`}
            media={item}
            index={index}
            isFocused={focusedIndex === index}
            onFocus={setFocusedIndex}
          />
        ))}
      </div>
    </section>
  );
}

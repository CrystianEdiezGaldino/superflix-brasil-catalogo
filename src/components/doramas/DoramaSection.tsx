
import { MediaItem } from "@/types/movie";
import DoramaCard from "@/components/doramas/DoramaCard";
import { useDoramaVideos } from "@/hooks/useDoramaVideos";

interface DoramaSectionProps {
  title: string;
  doramas: MediaItem[];
  isLoading: boolean;
}

const DoramaSection = ({ title, doramas, isLoading }: DoramaSectionProps) => {
  const { videoMap } = useDoramaVideos(doramas);

  if (isLoading) {
    return (
      <section className="mb-10">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-800 w-full aspect-[2/3] rounded-lg"></div>
              <div className="h-4 bg-gray-800 rounded mt-2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!doramas.length) {
    return null;
  }

  return (
    <section className="mb-10">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {doramas.map((dorama) => (
          <div key={dorama.id || Math.random()} className="animate-fade-in">
            <DoramaCard 
              dorama={dorama} 
              videoKey={dorama.id ? videoMap[dorama.id] || undefined : undefined}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default DoramaSection;

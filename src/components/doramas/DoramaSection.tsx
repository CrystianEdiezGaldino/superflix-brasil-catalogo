
import { Series } from "@/types/movie";
import MediaCard from "@/components/MediaCard";

interface DoramaSectionProps {
  title: string;
  doramas: Series[];
  isLoading: boolean;
}

const DoramaSection = ({ title, doramas, isLoading }: DoramaSectionProps) => {
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
          <div key={dorama.id} className="animate-fade-in">
            <MediaCard media={dorama} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default DoramaSection;

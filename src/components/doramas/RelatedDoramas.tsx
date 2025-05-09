
import { Series } from "@/types/movie";
import { Skeleton } from "@/components/ui/skeleton";
import DoramaCard from "./DoramaCard";
import { useDoramaVideos } from "@/hooks/useDoramaVideos";

interface RelatedDoramasProps {
  doramas: Series[];
  isLoading: boolean;
}

const RelatedDoramas = ({ doramas, isLoading }: RelatedDoramasProps) => {
  const { videoMap } = useDoramaVideos(doramas);

  if (isLoading) {
    return (
      <div className="my-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Doramas Relacionados</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (!doramas || doramas.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Doramas Relacionados</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {doramas.map((dorama) => (
          <DoramaCard 
            key={dorama.id} 
            dorama={dorama} 
            videoKey={videoMap[dorama.id] || undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedDoramas;


import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface DoramaCastSectionProps {
  cast: CastMember[];
  isLoading: boolean;
}

const DoramaCastSection = ({ cast, isLoading }: DoramaCastSectionProps) => {
  if (isLoading) {
    return (
      <div className="my-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Elenco</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-40 w-full rounded-md mb-2" />
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!cast || cast.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Elenco</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {cast.map((person) => (
          <Card key={person.id} className="bg-gray-800/50 border-none overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-[2/3] bg-gray-700">
                {person.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                    alt={person.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-xs text-center p-2">Imagem não disponível</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-white font-medium truncate">{person.name}</p>
                <p className="text-gray-400 text-sm truncate">{person.character}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DoramaCastSection;


import Navbar from "@/components/Navbar";
import DoramaBanner from "@/components/doramas/DoramaBanner";
import DoramaSynopsis from "@/components/doramas/DoramaSynopsis";
import DoramaCastSection from "@/components/doramas/DoramaCastSection";
import RelatedDoramas from "@/components/doramas/RelatedDoramas";
import VideoPlayer from "@/components/VideoPlayer";
import { Skeleton } from "@/components/ui/skeleton";
import { useDoramaDetails } from "@/hooks/dorama/useDoramaDetails";
import { useQuery } from "@tanstack/react-query";
import { fetchDoramaCast } from "@/services/tmdbApi";
import { Series } from "@/types/movie";

const DoramaDetails = () => {
  // Get dorama details and related functionality
  const {
    dorama,
    similarDoramas,
    isLoadingDorama,
    isLoadingSimilar,
    showPlayer,
    togglePlayer,
    authLoading,
    subscriptionLoading,
    user,
    hasAccess
  } = useDoramaDetails();

  // Empty search handler for Navbar
  const handleSearch = (query: string) => {
    // This page doesn't have search functionality
  };

  // Fetch cast information
  const { id } = dorama || {};
  const { data: cast, isLoading: isLoadingCast } = useQuery({
    queryKey: ["dorama-cast", id],
    queryFn: () => fetchDoramaCast(id?.toString() || "", 12),
    enabled: !!id,
  });
  
  const imdbId = dorama?.external_ids?.imdb_id;
  
  // Loading state
  if (isLoadingDorama) {
    return (
      <div className="min-h-screen bg-netflix-background">
        <Navbar onSearch={handleSearch} />
        <div className="pt-20">
          <Skeleton className="w-full h-[70vh]" />
          <div className="px-4 md:px-8 py-6">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-32 w-full mb-8" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!dorama) {
    return (
      <div className="min-h-screen bg-netflix-background">
        <Navbar onSearch={handleSearch} />
        <div className="flex flex-col items-center justify-center h-[70vh] text-white">
          <h2 className="text-2xl font-bold mb-2">Dorama não encontrado</h2>
          <p className="text-gray-400">O dorama solicitado não está disponível ou não existe.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={handleSearch} />
      
      <div className="pt-16">
        {/* Video Player or Banner */}
        {showPlayer && imdbId ? (
          <div className="p-4 md:p-8 bg-black">
            <VideoPlayer type="serie" imdbId={imdbId} />
            <button 
              onClick={togglePlayer}
              className="mt-4 text-white hover:underline"
            >
              Voltar para detalhes
            </button>
          </div>
        ) : (
          <DoramaBanner dorama={dorama} onPlay={togglePlayer} />
        )}
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <DoramaSynopsis overview={dorama.overview} />
          
          <DoramaCastSection 
            cast={cast || []} 
            isLoading={isLoadingCast} 
          />
          
          <RelatedDoramas 
            doramas={similarDoramas as Series[]} 
            isLoading={isLoadingSimilar} 
          />
        </div>
      </div>
    </div>
  );
};

export default DoramaDetails;

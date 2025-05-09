
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { fetchAnime, fetchTopRatedAnime, fetchSpecificAnimeRecommendations } from "@/services/tmdbApi";
import MediaCard from "@/components/MediaCard";
import { Series } from "@/types/movie";

const Animes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: popularAnime, isLoading: loadingPopular, error: popularError } = useQuery({
    queryKey: ["popularAnime"],
    queryFn: fetchAnime
  });

  const { data: topRatedAnime, isLoading: loadingTopRated, error: topRatedError } = useQuery({
    queryKey: ["topRatedAnime"],
    queryFn: fetchTopRatedAnime
  });

  const { data: specificRecommendations, isLoading: loadingSpecific, error: specificError } = useQuery({
    queryKey: ["specificAnimeRecommendations"],
    queryFn: fetchSpecificAnimeRecommendations
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const isLoading = loadingPopular || loadingTopRated || loadingSpecific;
  const hasError = popularError || topRatedError || specificError;

  if (hasError) {
    toast.error("Erro ao carregar dados dos animes");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-background">
        <Navbar onSearch={handleSearch} />
        <div className="container max-w-full pt-28 pb-20 px-4 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={handleSearch} />
      
      <div className="container max-w-full pt-28 pb-20 px-4">
        <h1 className="text-white text-3xl font-bold mb-8">Animes</h1>
        
        <section className="mb-12">
          <h2 className="text-white text-xl font-semibold mb-4">Animes Populares</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularAnime?.slice(0, 12).map((anime: Series) => (
              <MediaCard key={anime.id} media={anime} />
            ))}
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-white text-xl font-semibold mb-4">Animes Mais Bem Avaliados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {topRatedAnime?.slice(0, 12).map((anime: Series) => (
              <MediaCard key={anime.id} media={anime} />
            ))}
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-white text-xl font-semibold mb-4">Recomendações Especiais</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {specificRecommendations?.slice(0, 12).map((anime: Series) => (
              <MediaCard key={anime.id} media={anime} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Animes;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { useQuery } from "@tanstack/react-query";
import { fetchMovieDetails, fetchSeriesDetails } from "@/services/tmdbApi";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import MediaSection from "@/components/MediaSection";

const Favorites = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { favorites } = useFavorites();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("É necessário fazer login para acessar esta página");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Fetch details for each favorite
  const { data: favoriteDetails, isLoading } = useQuery({
    queryKey: ["favorites", favorites],
    queryFn: async () => {
      const details = await Promise.all(
        favorites.map(async (id) => {
          try {
            // Try to fetch as movie first
            const movie = await fetchMovieDetails(id.toString());
            if (movie) return movie;
            
            // If not found as movie, try as series
            const series = await fetchSeriesDetails(id.toString());
            return series;
          } catch (error) {
            console.error(`Error fetching details for ID ${id}:`, error);
            return null;
          }
        })
      );
      
      return details.filter(Boolean);
    },
    enabled: favorites.length > 0 && !!user,
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-netflix-background">
        <Navbar onSearch={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-gray-700 rounded"></div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">
          Meus Favoritos
        </h1>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              Você ainda não adicionou nenhum título aos favoritos.
            </p>
          </div>
        ) : (
          <MediaSection 
            title="Favoritos"
            medias={favoriteDetails || []}
          />
        )}
      </div>
    </div>
  );
};

export default Favorites;

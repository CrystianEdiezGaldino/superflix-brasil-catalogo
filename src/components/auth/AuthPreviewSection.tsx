
import { MediaItem } from "@/types/movie";
import ContentPreview from "@/components/home/ContentPreview";

interface AuthPreviewSectionProps {
  movies: MediaItem[];
  series: MediaItem[];
  animes: MediaItem[];
}

const AuthPreviewSection = ({ movies, series, animes }: AuthPreviewSectionProps) => {
  // Filter out content without images
  const filteredMovies = movies.filter(movie => movie.poster_path || movie.backdrop_path);
  const filteredSeries = series.filter(serie => serie.poster_path || serie.backdrop_path);
  const filteredAnimes = animes.filter(anime => anime.poster_path || anime.backdrop_path);

  // Only display the section if we have content with images
  const hasContent = filteredMovies.length > 0 || filteredSeries.length > 0 || filteredAnimes.length > 0;

  if (!hasContent) return null;

  return (
    <div className="mt-10 bg-black/50 py-10 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white">Veja o que você está perdendo</h2>
          <p className="text-gray-300 mt-2">Crie sua conta para acessar todo o catálogo</p>
        </div>
        
        <ContentPreview 
          movies={filteredMovies}
          series={filteredSeries}
          anime={filteredAnimes}
        />
      </div>
    </div>
  );
};

export default AuthPreviewSection;

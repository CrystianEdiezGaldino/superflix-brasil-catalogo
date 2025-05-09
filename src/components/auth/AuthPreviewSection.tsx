
import { MediaItem } from "@/types/movie";
import ContentPreview from "@/components/home/ContentPreview";

interface AuthPreviewSectionProps {
  movies: MediaItem[];
  series: MediaItem[];
  animes: MediaItem[];
}

const AuthPreviewSection = ({ movies, series, animes }: AuthPreviewSectionProps) => {
  return (
    <div className="mt-10 bg-black/50 py-10 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white">Veja o que você está perdendo</h2>
          <p className="text-gray-300 mt-2">Crie sua conta para acessar todo o catálogo</p>
        </div>
        
        <ContentPreview 
          movies={movies}
          series={series}
          anime={animes}
        />
      </div>
    </div>
  );
};

export default AuthPreviewSection;

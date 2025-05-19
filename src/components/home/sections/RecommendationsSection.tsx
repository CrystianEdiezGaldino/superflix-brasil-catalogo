
import { MediaItem, Movie, Series } from "@/types/movie";
import MediaSection from "@/components/MediaSection";

interface RecommendationsSectionProps {
  recommendations: MediaItem[];
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  sectionId?: string;
  sectionIndex?: number; // Add sectionIndex prop
}

const RecommendationsSection = ({ 
  recommendations,
  onLoadMore = () => {},
  isLoading = false,
  hasMore = false,
  sectionId = 'recommendations',
  sectionIndex = 0 // Default value
}: RecommendationsSectionProps) => {
  // Filter recommendations to recent and with images
  const filteredRecommendations = recommendations
    .filter(item => item.poster_path || item.backdrop_path)
    .filter(item => {
      const releaseDate = new Date(
        item.media_type === 'movie' 
          ? (item as Movie).release_date 
          : (item as Series).first_air_date || ''
      );
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
      return releaseDate >= fiveYearsAgo;
    });

  // Don't render if no recommendations
  if (!filteredRecommendations.length) {
    return null;
  }
  
  // Criar uma função de carregamento específica para esta seção
  const handleLoadMoreRecommendations = () => {
    // Passa o ID da seção para a função de carregamento
    onLoadMore();
    console.log(`Carregando mais recomendações para: ${sectionId}`);
  };
  
  return (
    <div className="recommendations-section-container" id={`section-${sectionId}`}>
      <MediaSection 
        title="Recomendados para Você" 
        medias={filteredRecommendations.slice(0, 5)}
        showLoadMore={hasMore && filteredRecommendations.length > 5}
        onLoadMore={handleLoadMoreRecommendations}
        isLoading={isLoading}
        sectionIndex={sectionIndex}
      />
    </div>
  );
};

export default RecommendationsSection;

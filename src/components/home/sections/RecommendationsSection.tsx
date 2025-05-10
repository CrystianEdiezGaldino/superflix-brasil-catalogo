
import { MediaItem, Movie, Series } from "@/types/movie";
import MediaSection from "@/components/MediaSection";

interface RecommendationsSectionProps {
  recommendations: MediaItem[];
}

const RecommendationsSection = ({ recommendations }: RecommendationsSectionProps) => {
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
    })
    .slice(0, 5);

  // Don't render if no recommendations
  if (!filteredRecommendations.length) {
    return null;
  }
  
  return (
    <MediaSection 
      title="Recomendados para Você" 
      medias={filteredRecommendations}
      showLoadMore={false}
    />
  );
};

export default RecommendationsSection;

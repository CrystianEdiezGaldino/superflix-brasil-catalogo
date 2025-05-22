
import React from "react";
import { MediaItem } from "@/types/movie";
import AnimeCarousel from "@/components/anime/AnimeCarousel";
import { useNavigate } from "react-router-dom";

interface HomeHeaderProps {
  featuredMedia: MediaItem | null;
  isAdmin?: boolean;
  hasAccess?: boolean;
  hasTrialAccess?: boolean;
  trialEnd?: string | null;
  searchQuery?: string;
  showFullContent?: boolean;
  onButtonClick?: () => void;
}

const HomeHeader = ({ 
  featuredMedia, 
  isAdmin = false, 
  hasAccess = false, 
  hasTrialAccess = false,
  trialEnd = null,
  searchQuery = "",
  showFullContent = false,
  onButtonClick
}: HomeHeaderProps) => {
  const navigate = useNavigate();
  // Calculate if the user has access based on hasAccess or hasTrialAccess
  const userHasAccess = hasAccess || hasTrialAccess;
  
  const handleAnimeClick = (media: MediaItem) => {
    if (media.media_type === 'movie') {
      navigate(`/filme/${media.id}`);
    } else if (media.media_type === 'tv') {
      navigate(`/serie/${media.id}`);
    } else if ((media as any).original_language === 'ja') {
      navigate(`/anime/${media.id}`);
    } else if ((media as any).original_language === 'ko') {
      navigate(`/dorama/${media.id}`);
    }
  };

  return (
    <div className="relative">
      {/* Show Carousel only when not searching */}
      {!searchQuery && featuredMedia && (
        <AnimeCarousel
          animes={[featuredMedia].filter(Boolean)}
          onAnimeClick={handleAnimeClick}
        />
      )}
    </div>
  );
};

export default HomeHeader;

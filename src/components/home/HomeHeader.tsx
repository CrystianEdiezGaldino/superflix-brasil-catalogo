import React from "react";
import { MediaItem, getMediaTitle, isMovie, isSeries } from "@/types/movie";

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
    if (!media) return;
    
    if (isMovie(media)) {
      navigate(`/filme/${media.id}`);
    } else if (isSeries(media)) {
      navigate(`/serie/${media.id}`);
      if (media.original_language === 'ja') {
        navigate(`/anime/${media.id}`);
      } else if (media.original_language === 'ko') {
        navigate(`/dorama/${media.id}`);
      }
    }
  };

  return (
    <div className="relative">
      {/* Show Carousel only when not searching */}
     
    </div>
  );
};

export default HomeHeader;

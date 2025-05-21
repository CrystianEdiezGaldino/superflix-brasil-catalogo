import React from "react";
import { MediaItem } from "@/types/movie";
import Banner from "@/components/Banner";

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
  // Calcula se o usuário tem acesso baseado em hasAccess ou hasTrialAccess
  const userHasAccess = hasAccess || hasTrialAccess;

  return (
    <div className="relative">
      {/* Show Banner only when not searching */}
      {!searchQuery && featuredMedia && (
        <Banner 
          media={featuredMedia}
          hasAccess={userHasAccess}
        />
      )}
    </div>
  );
};

export default HomeHeader;

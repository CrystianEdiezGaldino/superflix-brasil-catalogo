import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MediaItem } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface BannerProps {
  media: MediaItem;
  hasAccess?: boolean;
}

const Banner = ({ media, hasAccess = false }: BannerProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { isAdmin } = useSubscription();

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const getDetailsPath = () => {
    if (media.media_type === 'movie') {
      return `/filme/${media.id}`;
    } else if (media.media_type === 'tv') {
      return `/serie/${media.id}`;
    }
    return '/';
  };

  const getTitle = () => {
    if ('title' in media) {
      return media.title;
    } else if ('name' in media) {
      return media.name;
    }
    return '';
  };

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      {isImageLoading && (
        <div className="absolute inset-0 bg-black animate-pulse" />
      )}
      <img
        src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
        alt={getTitle()}
        className="w-full h-full object-cover"
        onLoad={handleImageLoad}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute bottom-0 left-0 p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">{getTitle()}</h1>
        <p className="text-lg mb-6 max-w-2xl">{media.overview}</p>
        {hasAccess || isAdmin ? (
          <Link to={getDetailsPath()}>
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md">
              Assistir
            </Button>
          </Link>
        ) : (
          <Link to="/assinatura">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md">
              Assine para Assistir
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Banner;

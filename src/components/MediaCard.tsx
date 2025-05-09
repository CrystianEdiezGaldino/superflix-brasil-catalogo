
import { Link } from "react-router-dom";
import { MediaItem } from "@/types/movie";

interface MediaCardProps {
  media: MediaItem;
}

const MediaCard = ({ media }: MediaCardProps) => {
  // Determine link path based on media type
  const linkPath = media.media_type === 'movie'
    ? `/filme/${media.id}`
    : `/serie/${media.id}`;

  // Handle missing poster image
  const posterUrl = media.poster_path
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : '/placeholder.svg';

  // Get title (handle both movie and tv show titles)
  const title = 'title' in media ? media.title : media.name;
  
  return (
    <Link 
      to={linkPath}
      className="block overflow-hidden rounded-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-netflix-red"
    >
      <div className="relative aspect-[2/3] bg-gray-900">
        <img 
          src={posterUrl}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="mt-2 text-sm text-white truncate">{title}</div>
    </Link>
  );
};

export default MediaCard;

import { MediaItem } from '@/types/movie';
import { Link } from 'react-router-dom';

interface MediaCardProps {
  item: MediaItem;
  showType?: boolean;
}

export function MediaCard({ item, showType = false }: MediaCardProps) {
  const title = item.title || item.name;
  const type = item.media_type === 'movie' ? 'Filme' : 'Série';
  const href = item.media_type === 'movie' ? `/filme/${item.id}` : `/serie/${item.id}`;

  return (
    <Link to={href} className="group">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
          alt={title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        {showType && (
          <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {type}
          </div>
        )}
      </div>
      <h3 className="mt-2 text-sm font-medium line-clamp-2">{title}</h3>
    </Link>
  );
} 
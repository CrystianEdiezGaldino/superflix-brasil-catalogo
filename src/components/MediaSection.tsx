import { Plus } from 'lucide-react';
import { MediaItem } from '@/types/movie';
import { Link } from 'react-router-dom';

interface MediaSectionProps {
  title: string;
  medias: MediaItem[];
  showLoadMore?: boolean;
  onLoadMore?: () => void;
}

const MediaSection = ({ title, medias, showLoadMore, onLoadMore }: MediaSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {medias.map((media) => (
          <Link 
            key={media.id} 
            to={`/${media.media_type}/${media.id}`}
            className="relative aspect-[2/3] rounded-lg overflow-hidden group"
          >
            <img
              src={`https://image.tmdb.org/t/p/w342${media.poster_path}`}
              alt={media.media_type === 'movie' ? (media as any).title : (media as any).name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <h3 className="text-sm font-medium text-white truncate">
                  {media.media_type === 'movie' ? (media as any).title : (media as any).name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
        {showLoadMore && onLoadMore && (
          <button
            onClick={onLoadMore}
            className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center"
          >
            <div className="flex flex-col items-center space-y-2">
              <Plus className="w-8 h-8 text-white" />
              <span className="text-sm text-white">Ver mais</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default MediaSection;

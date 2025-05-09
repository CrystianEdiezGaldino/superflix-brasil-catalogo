
import { Link } from "react-router-dom";
import { MediaItem } from "@/types/movie";
import { Card, CardContent } from "@/components/ui/card";

interface MediaCardProps {
  media: MediaItem;
}

const MediaCard = ({ media }: MediaCardProps) => {
  const title = "title" in media ? media.title : media.name;
  const releaseDate = "release_date" in media ? media.release_date : media.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "";
  const mediaType = media.media_type;
  const detailsPath = `/${mediaType === "movie" ? "filme" : "serie"}/${media.id}`;
  const voteAverage = media.vote_average ? media.vote_average.toFixed(1) : "?";

  return (
    <Card className="movie-card bg-transparent border-0 h-full transition-all duration-300">
      <Link to={detailsPath}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-md">
          {media.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <span className="text-gray-500 text-sm text-center px-2">{title}</span>
            </div>
          )}
          
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold py-1 px-2 rounded-md flex items-center">
            <span className="text-yellow-400 mr-1">★</span> {voteAverage}
          </div>
          
          <div className="movie-info absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
            <h3 className="text-white font-medium truncate text-sm md:text-base">{title}</h3>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-300">{year}</span>
              <span className="text-xs py-0.5 px-1.5 bg-netflix-red rounded text-white">
                {mediaType === "movie" ? "Filme" : "Série"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default MediaCard;

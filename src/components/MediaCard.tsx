
import { Link } from "react-router-dom";
import { MediaItem } from "@/types/movie";

interface MediaCardProps {
  media: MediaItem;
}

const MediaCard = ({ media }: MediaCardProps) => {
  const title = "title" in media ? media.title : media.name;
  const releaseDate = "release_date" in media ? media.release_date : media.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "";
  const mediaType = media.media_type;
  const detailsPath = `/${mediaType === "movie" ? "filme" : "serie"}/${media.id}`;

  return (
    <div className="movie-card">
      <Link to={detailsPath}>
        {media.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w300${media.poster_path}`}
            alt={title}
            className="w-full h-auto rounded-md object-cover"
          />
        ) : (
          <div className="w-full h-[450px] bg-gray-800 flex items-center justify-center rounded-md">
            <span className="text-gray-500">{title}</span>
          </div>
        )}
        <div className="movie-info">
          <h3 className="text-white font-semibold truncate">{title}</h3>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">{year}</span>
            <span className="text-xs py-0.5 px-1.5 bg-netflix-red rounded text-white">
              {mediaType === "movie" ? "Filme" : "Série"}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MediaCard;

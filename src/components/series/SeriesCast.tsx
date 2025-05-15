import { Series } from "@/types/movie";

interface SeriesCastProps {
  series: Series;
}

const SeriesCast = ({ series }: SeriesCastProps) => {
  const cast = series.credits?.cast || [];

  if (cast.length === 0) {
    return null;
  }

  return (
    <div className="px-4 sm:px-6 md:px-10 mb-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
          Elenco
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
          {cast.slice(0, 8).map((actor) => (
            <div key={actor.id} className="flex flex-col items-center">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2">
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    alt={actor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-netflix-gray flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No image</span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3 className="text-xs sm:text-sm font-medium text-white truncate w-full">
                  {actor.name}
                </h3>
                <p className="text-xs text-gray-400 truncate w-full">
                  {actor.character}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeriesCast; 
import { Series } from "@/types/movie";

interface SeriesCastProps {
  series: Series;
}

const SeriesCast = ({ series }: SeriesCastProps) => {
  if (!series.credits?.cast || series.credits.cast.length === 0) {
    return null;
  }

  const top5Cast = series.credits.cast.slice(0, 5);

  return (
    <div className="px-6 md:px-10 mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">Elenco Principal</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {top5Cast.map((actor) => (
          <div key={actor.id} className="flex flex-col items-center">
            <div className="w-full aspect-[2/3] rounded-lg overflow-hidden mb-2">
              {actor.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium text-white text-center">{actor.name}</h3>
            <p className="text-xs text-gray-400 text-center">{actor.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeriesCast; 
import { Link } from "react-router-dom";
import { Series } from "@/types/movie";

interface SeriesRecommendationsProps {
  series: Series;
}

const SeriesRecommendations = ({ series }: SeriesRecommendationsProps) => {
  if (!series.recommendations?.results || series.recommendations.results.length === 0) {
    return null;
  }

  return (
    <div className="px-6 md:px-10 mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">Recomendações</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {series.recommendations.results.slice(0, 6).map((recommendation) => (
          <Link
            key={recommendation.id}
            to={`/dorama/${recommendation.id}`}
            className="group"
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
              {recommendation.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w342${recommendation.poster_path}`}
                  alt={recommendation.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <h3 className="text-sm font-medium text-white truncate">{recommendation.name}</h3>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SeriesRecommendations; 
import { Movie, Series } from '@/types/movie';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface MovieHeaderProps {
  movie: Movie | Series;
}

export const MovieHeader = ({ movie }: MovieHeaderProps) => {
  const title = 'title' in movie ? movie.title : movie.name;
  const releaseDate = 'release_date' in movie ? movie.release_date : movie.first_air_date;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black z-10" />
      <img
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={title}
        className="w-full h-[60vh] object-cover"
      />
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center text-white hover:text-gray-300 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-300">
            {new Date(releaseDate).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
}; 
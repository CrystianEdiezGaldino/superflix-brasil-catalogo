
import { Film } from "lucide-react";

const AuthPageBanner = () => {
  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center justify-center p-3 bg-netflix-red rounded-full mb-4">
        <Film size={32} className="text-white" />
      </div>
      <h2 className="text-4xl font-bold text-white">Acesse sua conta</h2>
      <p className="text-xl text-gray-300 mt-2">Filmes, séries, animes e muito mais em um só lugar</p>
    </div>
  );
};

export default AuthPageBanner;

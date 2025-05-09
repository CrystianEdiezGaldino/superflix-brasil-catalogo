
import { Film, Tv } from "lucide-react";

const ContentCategories = () => {
  return (
    <div className="mt-12 bg-gray-800 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 text-center">Nosso conteúdo para todos os gostos</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        <div className="flex flex-col items-center text-gray-300 hover:text-white">
          <Film size={28} className="mb-2" />
          <span className="text-sm">Filmes</span>
        </div>
        <div className="flex flex-col items-center text-gray-300 hover:text-white">
          <Tv size={28} className="mb-2" />
          <span className="text-sm">Séries</span>
        </div>
        <div className="flex flex-col items-center text-gray-300 hover:text-white">
          <div className="mb-2 text-2xl">🎭</div>
          <span className="text-sm">Doramas</span>
        </div>
        <div className="flex flex-col items-center text-gray-300 hover:text-white">
          <div className="mb-2 text-2xl">🍥</div>
          <span className="text-sm">Animes</span>
        </div>
        <div className="flex flex-col items-center text-gray-300 hover:text-white">
          <div className="mb-2 text-2xl">🎓</div>
          <span className="text-sm">Documentários</span>
        </div>
        <div className="flex flex-col items-center text-gray-300 hover:text-white">
          <div className="mb-2 text-2xl">🎮</div>
          <span className="text-sm">Games</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
            <div className="flex items-center">
              <span className="mr-1">📱</span>
              <span className="mr-1">💻</span>
              <span>📺</span>
            </div>
            <span>Assista onde quiser</span>
          </h4>
          <p className="text-gray-400 text-sm">
            Assista no celular, tablet, smart TV, notebook ou qualquer outro dispositivo.
          </p>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
            <span>🏆</span>
            <span>Qualidade 4K</span>
          </h4>
          <p className="text-gray-400 text-sm">
            Aproveite imagens nítidas com alta resolução de até 4K (quando disponível).
          </p>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
            <span>⭐</span>
            <span>Conteúdo premiado</span>
          </h4>
          <p className="text-gray-400 text-sm">
            Acesso aos melhores filmes, séries, documentários e muito mais.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentCategories;


import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Bell, VideoOff } from 'lucide-react';

interface ContentNotAvailableProps {
  onAddToFavorites?: () => void;
}

const ContentNotAvailable = ({ onAddToFavorites }: ContentNotAvailableProps) => {
  const [isNotified, setIsNotified] = useState(false);

  const handleAddToFavorites = () => {
    if (onAddToFavorites) {
      onAddToFavorites();
      setIsNotified(true);
      toast.success("Conteúdo adicionado aos favoritos! Você será notificado quando estiver disponível.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-900 rounded-lg border border-gray-800 shadow-lg">
      <VideoOff className="w-16 h-16 mb-4 text-red-500" />
      <h1 className="text-2xl font-bold mb-2">Conteúdo Indisponível</h1>
      <p className="text-gray-300 mb-4">Este conteúdo não está disponível no momento.</p>
      <p className="text-gray-300 mb-4">Estamos trabalhando para disponibilizá-lo em breve!</p>
      {!isNotified && onAddToFavorites && (
        <Button
          onClick={handleAddToFavorites}
          className="mt-4 flex items-center gap-2"
          variant="destructive"
        >
          <Bell className="w-4 h-4" />
          Notificar quando disponível
        </Button>
      )}
      {isNotified && (
        <p className="text-green-500 mt-4 flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Você será notificado quando este conteúdo estiver disponível!
        </p>
      )}
    </div>
  );
};

export default ContentNotAvailable;

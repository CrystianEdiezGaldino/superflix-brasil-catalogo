import { useState } from 'react';
import { toast } from 'sonner';

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
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fillRule="evenodd" 
        strokeLinejoin="round" 
        strokeMiterlimit="2" 
        clipRule="evenodd" 
        viewBox="0 0 32 32"
        className="w-16 h-16 mb-4 text-red-500"
      >
        <path d="M31 6.2c0-.583-.232-1.143-.644-1.556A2.2045 2.2045 0 0 0 28.8 4H3.2c-.583 0-1.143.232-1.556.644C1.232 5.057 1 5.617 1 6.2v19.6c0 .583.232 1.143.644 1.556.413.412.973.644 1.556.644h25.6c.583 0 1.143-.232 1.556-.644.412-.413.644-.973.644-1.556zM3 10v15.8c0 .053.021.104.059.141.037.038.088.059.141.059h25.6c.053 0 .104-.021.141-.059A.1966.1966 0 0 0 29 25.8V11h-6.717c-.341 0-.678-.08-.984-.232l-1.493-.747a.1974.1974 0 0 0-.089-.021zm26-1V6.2c0-.053-.021-.104-.059-.141A.1966.1966 0 0 0 28.8 6H3.2c-.053 0-.104.021-.141.059A.1966.1966 0 0 0 3 6.2V8h16.717c.341 0 .678.08.984.232l1.493.747c.028.014.058.021.089.021z"></path>
        <path d="m9.086 16.5-.793.793c-.39.39-.39 1.024 0 1.414s1.024.39 1.414 0l.793-.793.793.793c.39.39 1.024.39 1.414 0s.39-1.024 0-1.414l-.793-.793.793-.793c.39-.39.39-1.024 0-1.414s-1.024-.39-1.414 0l-.793.793-.793-.793c-.39-.39-1.024-.39-1.414 0s-.39 1.024 0 1.414zm11 0-.793.793c-.39.39-.39 1.024 0 1.414s1.024.39 1.414 0l.793-.793.793.793c.39.39 1.024.39 1.414 0s.39-1.024 0-1.414l-.793-.793.793-.793c.39-.39.39-1.024 0-1.414s-1.024-.39-1.414 0l-.793.793-.793-.793c-.39-.39-1.024-.39-1.414 0s-.39 1.024 0 1.414zm-8.533 6.394s.871.436 1.463.732c.619.31 1.349.31 1.968 0l.927-.463a.1991.1991 0 0 1 .178 0l.927.463c.619.31 1.349.31 1.968 0 .592-.296 1.463-.732 1.463-.732.494-.246.694-.848.447-1.341-.246-.494-.848-.694-1.341-.447l-1.464.731a.1991.1991 0 0 1-.178 0l-.927-.463c-.619-.31-1.349-.31-1.968 0l-.927.463a.1991.1991 0 0 1-.178 0l-1.464-.731c-.493-.247-1.095-.047-1.341.447-.247.493-.047 1.095.447 1.341z"></path>
      </svg>
      <h1 className="text-2xl font-bold mb-2">Conteúdo Indisponível</h1>
      <p className="text-gray-300 mb-4">Este conteúdo não está disponível no momento.</p>
      <p className="text-gray-300 mb-4">Estamos trabalhando para disponibilizá-lo em breve!</p>
      {!isNotified && (
        <button
          onClick={handleAddToFavorites}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Adicionar aos Favoritos
        </button>
      )}
      {isNotified && (
        <p className="text-green-500 mt-4">
          Você será notificado quando este conteúdo estiver disponível!
        </p>
      )}
    </div>
  );
};

export default ContentNotAvailable; 
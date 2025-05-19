import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onClose: () => void;
  currentInput: 'email' | 'password' | null;
  onBackspace: () => void;
}

const VirtualKeyboard = ({ onKeyPress, onEnter, onClose, currentInput, onBackspace }: VirtualKeyboardProps) => {
  const [isShift, setIsShift] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Aumentando o limite para 1024px para incluir tablets
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Removendo a verificação de mobile aqui para permitir que o componente pai controle a visibilidade
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const letters = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ];
  const specialChars = ['.', '@', '_', '-'];

  const handleKeyPress = (key: string) => {
    onKeyPress(isShift ? key.toUpperCase() : key.toLowerCase());
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-gray-900/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-gray-700"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-400">
          {currentInput === 'email' ? 'Email' : currentInput === 'password' ? 'Senha' : 'Enviar'}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {/* Numbers */}
        <div className="grid grid-cols-10 gap-1">
          {numbers.map((num) => (
            <Button
              key={num}
              variant="outline"
              size="sm"
              onClick={() => handleKeyPress(num)}
              className="h-8 w-8 text-sm font-medium bg-gray-800 border-gray-700 hover:bg-gray-700"
            >
              {num}
            </Button>
          ))}
        </div>

        {/* Letters */}
        {letters.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-10 gap-1">
            {row.map((letter) => (
              <Button
                key={letter}
                variant="outline"
                size="sm"
                onClick={() => handleKeyPress(letter)}
                className="h-8 w-8 text-sm font-medium bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                {isShift ? letter.toUpperCase() : letter}
              </Button>
            ))}
          </div>
        ))}

        {/* Special Characters */}
        <div className="grid grid-cols-10 gap-1">
          {specialChars.map((char) => (
            <Button
              key={char}
              variant="outline"
              size="sm"
              onClick={() => handleKeyPress(char)}
              className="h-8 w-8 text-sm font-medium bg-gray-800 border-gray-700 hover:bg-gray-700"
            >
              {char}
            </Button>
          ))}
        </div>

        {/* Control Keys */}
        <div className="grid grid-cols-10 gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShift(!isShift)}
            className={`col-span-2 h-8 text-sm font-medium ${
              isShift ? 'bg-netflix-red border-netflix-red' : 'bg-gray-800 border-gray-700'
            } hover:bg-gray-700`}
          >
            Shift
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onBackspace}
            className="col-span-2 h-8 text-sm font-medium bg-gray-800 border-gray-700 hover:bg-gray-700"
          >
            ←
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onEnter}
            className="col-span-6 h-8 text-sm font-medium bg-netflix-red border-netflix-red hover:bg-red-700"
          >
            Enter
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default VirtualKeyboard; 
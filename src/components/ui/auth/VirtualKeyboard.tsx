
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X, Keyboard as KeyboardIcon, ArrowRight, Delete, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  isOpen: boolean;
  onToggle: () => void;
  currentField: string;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  onEnter,
  onBackspace,
  isOpen,
  onToggle,
  currentField
}) => {
  const [showSymbols, setShowSymbols] = useState(false);
  
  // Layout para letras e números
  const mainKeys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', '.', '@']
  ];
  
  // Layout para símbolos
  const symbolKeys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
    ['-', '_', '+', '=', '[', ']', '{', '}', '|', '\\'],
    [':', ';', '"', "'", ',', '.', '<', '>', '/', '?']
  ];
  
  const currentKeys = showSymbols ? symbolKeys : mainKeys;

  // Alterna entre letras/números e símbolos
  const toggleSymbols = () => {
    setShowSymbols(!showSymbols);
  };

  // Determina o texto do botão Enter
  const getEnterText = () => {
    switch(currentField) {
      case 'email':
        return 'Para senha';
      case 'password':
        return 'Entrar';
      default:
        return 'Próximo';
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 flex items-center justify-center bg-netflix-red hover:bg-red-700"
        aria-label="Abrir teclado virtual"
      >
        <KeyboardIcon className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ y: 300, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 300, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-gray-800 p-3 shadow-lg z-50"
    >
      <div className="flex justify-between items-center mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-400 hover:text-white"
          onClick={toggleSymbols}
        >
          {showSymbols ? 'ABC' : '!@#'}
        </Button>
        
        <h3 className="text-gray-300 text-xs font-semibold">
          {currentField === 'email' ? 'Digitando email' : 'Digitando senha'}
        </h3>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-gray-400 hover:text-white"
          aria-label="Fechar teclado"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-1.5">
        {currentKeys.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5">
            {row.map((key) => (
              <Button
                key={key}
                onClick={() => onKeyPress(key)}
                className={cn(
                  "flex-1 h-10 sm:h-12 bg-gray-800 text-white hover:bg-gray-700 border border-gray-700",
                  key === '@' && "text-netflix-red"
                )}
              >
                {key}
              </Button>
            ))}
          </div>
        ))}

        <div className="flex justify-center gap-1.5 mt-1">
          <Button
            onClick={toggleSymbols}
            className="w-1/6 bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
            aria-label={showSymbols ? "Mostrar letras" : "Mostrar símbolos"}
          >
            {showSymbols ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
          
          <Button
            onClick={() => onKeyPress(' ')}
            className="flex-1 bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
          >
            espaço
          </Button>
          
          <Button
            onClick={onBackspace}
            className="w-1/6 bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
            aria-label="Apagar"
          >
            <Delete className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={onEnter}
            className="w-1/4 bg-netflix-red hover:bg-red-700 text-white"
          >
            <span className="hidden sm:inline">{getEnterText()}</span>
            <ArrowRight className="h-4 w-4 sm:ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default VirtualKeyboard;

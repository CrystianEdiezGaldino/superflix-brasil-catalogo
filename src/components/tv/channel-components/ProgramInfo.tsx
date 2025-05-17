
import React from 'react';
import { Clock } from 'lucide-react';

interface Program {
  time: string;
  title: string;
  description: string;
}

interface ProgramInfoProps {
  isVisible: boolean;
  programs: Program[];
}

const ProgramInfo = ({ isVisible, programs }: ProgramInfoProps) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 mb-5 border border-gray-700/50 animate-fade-in">
      <h3 className="flex items-center gap-2 font-medium text-white mb-3">
        <Clock size={16} className="text-netflix-red" />
        <span>Programação</span>
      </h3>
      <div className="space-y-3">
        {programs.map((program, index) => (
          <div key={index} className={`flex gap-3 pb-3 ${index < programs.length - 1 ? 'border-b border-gray-700/50' : ''}`}>
            <div className="text-netflix-red font-medium w-14">{program.time}</div>
            <div>
              <div className="font-medium text-white">{program.title}</div>
              <div className="text-sm text-gray-400">{program.description}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4 text-xs text-gray-500">
        Informações de programação podem variar. Verifique a grade completa no site do canal.
      </div>
    </div>
  );
};

export default ProgramInfo;

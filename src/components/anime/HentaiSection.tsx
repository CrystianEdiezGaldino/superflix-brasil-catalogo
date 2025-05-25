
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MediaItem, getMediaTitle } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Lock, EyeOff, Eye } from "lucide-react";

interface HentaiSectionProps {
  title: string;
  hentais: MediaItem[];
  onMediaClick: (media: MediaItem) => void;
  isVisible: boolean;
  onToggleVisibility: (password: string) => boolean;
}

const HentaiSection: React.FC<HentaiSectionProps> = ({
  title,
  hentais,
  onMediaClick,
  isVisible,
  onToggleVisibility
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const { user } = useAuth();

  // Safety check for hentais array
  const validHentais = Array.isArray(hentais) ? hentais.filter(hentai => 
    hentai && (hentai.poster_path || hentai.backdrop_path)
  ) : [];
  
  // If no valid hentais, don't render anything
  if (!validHentais.length) {
    return null;
  }

  const handlePasswordSubmit = () => {
    const success = onToggleVisibility(password);
    
    if (success) {
      setIsDialogOpen(false);
      setPassword("");
      toast.success("Conteúdo adulto desbloqueado");
    } else {
      toast.error("Senha incorreta!");
    }
  };

  return (
    <section className="mb-12 bg-red-900/20 p-6 rounded-xl backdrop-blur-sm border border-red-800/30">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <EyeOff className="mr-2 text-red-500" size={24} />
          {title}
          <span className="ml-2 text-xs bg-red-600 px-2 py-1 rounded-full">+18</span>
        </h2>
        <Button 
          variant="outline" 
          size="sm"
          className={isVisible ? "text-green-500 border-green-500" : "text-gray-400 border-gray-400"}
          onClick={() => isVisible ? onToggleVisibility("") : setIsDialogOpen(true)}
        >
          {isVisible ? (
            <>
              <Eye size={16} className="mr-2" /> Conteúdo Desbloqueado
            </>
          ) : (
            <>
              <Lock size={16} className="mr-2" /> Conteúdo Bloqueado
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {validHentais.map((hentai, index) => (
          <div
            key={`${hentai.id}-${index}`}
            className="relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => isVisible ? onMediaClick(hentai) : setIsDialogOpen(true)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${hentai.poster_path || hentai.backdrop_path}`}
              alt={getMediaTitle(hentai)}
              className={`w-full h-full object-cover ${!isVisible ? 'blur-md' : ''}`}
              loading="lazy"
            />
            <div className={`absolute inset-0 ${isVisible ? 'bg-black/40 group-hover:bg-black/60' : 'bg-black/70'} transition-all duration-300`}>
              {!isVisible ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <Lock className="text-white/80 w-10 h-10 mb-2" />
                  <h3 className="text-white font-medium mb-1 line-clamp-2">{getMediaTitle(hentai)}</h3>
                  <p className="text-sm text-gray-300">Clique para desbloquear</p>
                  <span className="mt-2 text-xs bg-red-600 px-2 py-1 rounded-full">+18</span>
                </div>
              ) : (
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-medium truncate">{getMediaTitle(hentai)}</h3>
                  <Button 
                    size="sm" 
                    className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    Assistir
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Verificação de Conteúdo Adulto (+18)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Este conteúdo é restrito para maiores de 18 anos. Para acessar, digite a senha da sua conta (por padrão, use "admin123").
            </p>
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border-gray-700"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePasswordSubmit();
                }
              }}
            />
            <Button onClick={handlePasswordSubmit} className="w-full bg-red-600 hover:bg-red-700">
              Desbloquear
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HentaiSection;

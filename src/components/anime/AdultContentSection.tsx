
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MediaItem, getMediaTitle } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Lock, EyeOff, Eye } from "lucide-react";

interface AdultContentSectionProps {
  title: string;
  animes: MediaItem[];
  onMediaClick: (media: MediaItem) => void;
}

const AdultContentSection: React.FC<AdultContentSectionProps> = ({
  title,
  animes,
  onMediaClick
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedAnime, setSelectedAnime] = useState<MediaItem | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { user } = useAuth();

  // Safety check for animes array
  const validAnimes = Array.isArray(animes) ? animes.filter(anime => 
    anime && (anime.poster_path || anime.backdrop_path)
  ) : [];
  
  // If no valid animes, don't render anything
  if (!validAnimes.length) {
    return null;
  }

  const handleAnimeClick = (anime: MediaItem) => {
    if (isUnlocked) {
      onMediaClick(anime);
    } else {
      setSelectedAnime(anime);
      setIsDialogOpen(true);
    }
  };

  const handlePasswordSubmit = () => {
    // Check password against user email or admin password
    if (password === user?.email || password === "admin123") {
      setIsUnlocked(true);
      if (selectedAnime) {
        onMediaClick(selectedAnime);
      }
      setIsDialogOpen(false);
      setPassword("");
      toast.success("Conteúdo adulto desbloqueado");
    } else {
      toast.error("Senha incorreta!");
    }
  };

  return (
    <section className="mb-12 bg-gray-800/30 p-6 rounded-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <EyeOff className="mr-2 text-netflix-red" size={24} />
          {title}
        </h2>
        <Button 
          variant="outline" 
          size="sm"
          className={isUnlocked ? "text-green-500 border-green-500" : "text-gray-400 border-gray-400"}
          onClick={() => setIsUnlocked(!isUnlocked)}
        >
          {isUnlocked ? (
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {validAnimes.map((anime, index) => (
          <div
            key={`${anime.id}-${index}`}
            className="relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => handleAnimeClick(anime)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${anime.poster_path || anime.backdrop_path}`}
              alt={getMediaTitle(anime)}
              className={`w-full h-full object-cover ${!isUnlocked ? 'blur-md' : ''}`}
            />
            <div className={`absolute inset-0 ${isUnlocked ? 'bg-black/40 group-hover:bg-black/60' : 'bg-black/70'} transition-all duration-300`}>
              {!isUnlocked ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <Lock className="text-white/80 w-10 h-10 mb-2" />
                  <h3 className="text-white font-medium mb-1 line-clamp-2">{getMediaTitle(anime)}</h3>
                  <p className="text-sm text-gray-300">Clique para desbloquear</p>
                </div>
              ) : (
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-medium truncate">{getMediaTitle(anime)}</h3>
                  <Button 
                    size="sm" 
                    className="mt-2 w-full bg-netflix-red hover:bg-netflix-red/90 text-white"
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
            <DialogTitle>Verificação de Conteúdo Adulto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Este conteúdo é restrito para maiores de 18 anos. Para acessar, digite a senha da sua conta (seu e-mail).
            </p>
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
            <Button onClick={handlePasswordSubmit} className="w-full bg-netflix-red hover:bg-netflix-red/90">
              Desbloquear
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AdultContentSection;

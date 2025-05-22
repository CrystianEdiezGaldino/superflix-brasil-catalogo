import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MediaItem } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
  const { user } = useAuth();

  const handleAnimeClick = (anime: MediaItem) => {
    setSelectedAnime(anime);
    setIsDialogOpen(true);
  };

  const handlePasswordSubmit = () => {
    // Aqui você pode implementar a lógica de verificação da senha
    // Por enquanto, vamos apenas simular uma verificação básica
    if (password === "123456") { // Substitua por sua lógica de verificação
      if (selectedAnime) {
        onMediaClick(selectedAnime);
      }
      setIsDialogOpen(false);
      setPassword("");
    } else {
      toast.error("Senha incorreta");
    }
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="text-sm text-gray-400">Conteúdo Adulto</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {animes.map((anime, index) => (
          <div
            key={`${anime.id}-${index}`}
            className="relative aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => handleAnimeClick(anime)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center p-4">
                <div className="text-white font-medium mb-2">{anime.title || anime.name}</div>
                <div className="text-sm text-gray-300">Clique para desbloquear</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conteúdo Adulto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Este conteúdo é restrito. Por favor, insira sua senha para continuar.
            </p>
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handlePasswordSubmit} className="w-full">
              Desbloquear
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AdultContentSection; 
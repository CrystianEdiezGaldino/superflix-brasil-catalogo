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
  isVisible: boolean;
  onToggleVisibility: (password: string) => boolean;
}
const AdultContentSection: React.FC<AdultContentSectionProps> = ({
  title,
  animes,
  onMediaClick,
  isVisible,
  onToggleVisibility
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const {
    user
  } = useAuth();

  // Safety check for animes array
  const validAnimes = Array.isArray(animes) ? animes.filter(anime => anime && (anime.poster_path || anime.backdrop_path)) : [];

  // If no valid animes, don't render anything
  if (!validAnimes.length) {
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
  return;
};
export default AdultContentSection;
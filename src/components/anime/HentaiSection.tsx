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
  const {
    user
  } = useAuth();

  // Safety check for hentais array
  const validHentais = Array.isArray(hentais) ? hentais.filter(hentai => hentai && (hentai.poster_path || hentai.backdrop_path)) : [];

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
  return;
};
export default HentaiSection;
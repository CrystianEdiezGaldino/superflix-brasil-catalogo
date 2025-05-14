
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { TvChannel } from '@/types/tvChannel';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface TvChannelModalProps {
  channel: TvChannel | null;
  isOpen: boolean;
  onClose: () => void;
}

const TvChannelModal = ({ channel, isOpen, onClose }: TvChannelModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!channel) return null;

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Formatando o nome do canal para usar como slug na URL do embed
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] bg-netflix-background border-netflix-red">
        <DialogTitle className="text-2xl font-bold text-white">
          {channel.name}
        </DialogTitle>
        <DialogDescription className="text-gray-400">
          Assistindo ao vivo
        </DialogDescription>
        
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-netflix-red"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="w-full h-full relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
          
          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4 text-center">
              <AlertCircle className="h-12 w-12 text-netflix-red mb-4" />
              <h3 className="text-xl font-bold mb-2">Erro ao carregar o canal</h3>
              <p className="mb-4">Não foi possível carregar o stream deste canal. Por favor, tente novamente mais tarde.</p>
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white/10"
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                }}
              >
                Tentar novamente
              </Button>
            </div>
          )}
          
          <AspectRatio ratio={16/9} className="bg-black">
            <iframe
              src={channel.embedUrl}
              className="w-full h-full border-0"
              allowFullScreen
              title={`Assistir ${channel.name} ao vivo`}
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          </AspectRatio>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TvChannelModal;


import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TvChannel } from "@/data/tvChannels";
import { Button } from "@/components/ui/button";
import { X, Info, Clock, Tv } from "lucide-react";

interface TvChannelModalProps {
  channel: TvChannel;
  isOpen: boolean;
  onClose: () => void;
  hasAccess: boolean;
  options?: {
    preventClose?: boolean;
    closeOnOutsideClick?: boolean;
    closeOnEsc?: boolean;
  };
}

const TvChannelModal = ({ channel, isOpen, onClose, hasAccess, options = {} }: TvChannelModalProps) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [isProgramInfoVisible, setIsProgramInfoVisible] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset iframe loaded state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsIframeLoaded(false);
    }
  }, [isOpen]);

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsIframeLoaded(true);
  };

  // Prevent modal from closing when clicking outside or pressing ESC
  const handleOpenChange = (open: boolean) => {
    if (!open && options.preventClose) {
      return;
    }
    onClose();
  };

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden, maintain state
        if (iframeRef.current) {
          iframeRef.current.style.display = 'none';
        }
      } else {
        // Tab is visible again, restore state
        if (iframeRef.current) {
          iframeRef.current.style.display = 'block';
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Mock da programação (em produção isso viria de uma API)
  const currentPrograms = [
    { time: "Agora", title: "Programa atual", description: "Descrição do programa atual" },
    { time: "18:30", title: "Próximo programa", description: "Descrição do próximo programa" },
    { time: "20:00", title: "Mais tarde", description: "Descrição do programa mais tarde" }
  ];

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleOpenChange}
    >
      <DialogContent 
        ref={modalRef}
        className="max-w-4xl bg-gray-900 border-gray-800 p-0 overflow-hidden"
        onPointerDownOutside={(e) => {
          if (options.closeOnOutsideClick === false) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (options.closeOnEsc === false) {
            e.preventDefault();
          }
        }}
      >
        <div className="relative">
          <DialogHeader className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {channel.logoUrl && (
                  <div className="h-10 w-10 bg-white/10 rounded p-1 flex items-center justify-center">
                    <img 
                      src={channel.logoUrl} 
                      alt={channel.name} 
                      className="max-h-full max-w-full object-contain" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <DialogTitle className="text-xl font-bold text-white">
                  {channel.name}
                </DialogTitle>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-black/40 hover:bg-black/60 text-white"
                  onClick={() => setIsProgramInfoVisible(!isProgramInfoVisible)}
                  title="Informações da programação"
                >
                  <Info className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full bg-black/40 hover:bg-black/60 text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <DialogDescription className="sr-only">
              {channel.description}
            </DialogDescription>
          </DialogHeader>

          <div className="w-full">
            {hasAccess ? (
              <div className="aspect-video w-full bg-black relative">
                {!isIframeLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
                    <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mb-4"></div>
                    <div className="text-white text-sm">Carregando transmissão...</div>
                  </div>
                )}
                <iframe
                  ref={iframeRef}
                  src={channel.iframeUrl}
                  allow="encrypted-media"
                  allowFullScreen
                  className="w-full h-full"
                  frameBorder="0"
                  onLoad={handleIframeLoad}
                  style={{ opacity: isIframeLoaded ? 1 : 0 }}
                  title={`${channel.name} - TV ao vivo`}
                />
              </div>
            ) : (
              <div className="aspect-video w-full bg-gray-900/80 flex items-center justify-center">
                <div className="text-center p-8 max-w-lg">
                  <div className="bg-netflix-red/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Tv size={32} className="text-netflix-red" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Conteúdo Exclusivo</h3>
                  <p className="text-gray-300 mb-6">
                    Este canal é exclusivo para assinantes. Assine agora para ter acesso ilimitado a todos os canais.
                  </p>
                  <Button 
                    className="bg-netflix-red hover:bg-red-700 px-8"
                    onClick={() => window.location.href = '/subscribe'}
                  >
                    Ver planos
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="p-5">
            {isProgramInfoVisible && (
              <div className="bg-gray-800/50 rounded-lg p-4 mb-5 border border-gray-700/50 animate-fade-in">
                <h3 className="flex items-center gap-2 font-medium text-white mb-3">
                  <Clock size={16} className="text-netflix-red" />
                  <span>Programação</span>
                </h3>
                <div className="space-y-3">
                  {currentPrograms.map((program, index) => (
                    <div key={index} className={`flex gap-3 pb-3 ${index < currentPrograms.length - 1 ? 'border-b border-gray-700/50' : ''}`}>
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
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Sobre o Canal</h3>
              <p className="text-gray-300">{channel.description}</p>
              
              <div className="pt-2">
                <div className="inline-block bg-gray-800/50 text-xs font-medium text-white px-2.5 py-1 rounded">
                  {channel.category}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(TvChannelModal);

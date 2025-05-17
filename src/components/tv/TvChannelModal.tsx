import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TvChannel } from "@/data/tvChannels";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

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
        setIsVisible(false);
        if (iframeRef.current) {
          iframeRef.current.style.display = 'none';
        }
      } else {
        // Tab is visible again, restore state
        setIsVisible(true);
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

  // Handle iframe visibility
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.style.display = isVisible ? 'block' : 'none';
    }
  }, [isVisible]);

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleOpenChange}
    >
      <DialogContent 
        ref={modalRef}
        className="max-w-4xl bg-netflix-background border-netflix-border"
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
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center justify-between">
            <span>{channel.name}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-netflix-card-hover"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription className="sr-only">
            {channel.description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {hasAccess ? (
            <div className="aspect-video w-full bg-black relative">
              {!isIframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
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
                style={{ 
                  opacity: isIframeLoaded ? 1 : 0,
                  display: isVisible ? 'block' : 'none'
                }}
                title={`${channel.name} - TV ao vivo`}
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-black flex items-center justify-center">
              <div className="text-center p-8">
                <h3 className="text-xl font-bold text-white mb-2">Conteúdo Exclusivo</h3>
                <p className="text-gray-400">
                  Assine agora para ter acesso a todos os canais de TV ao vivo.
                </p>
              </div>
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white mb-2">Sobre o Canal</h3>
            <p className="text-gray-300">{channel.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(TvChannelModal);

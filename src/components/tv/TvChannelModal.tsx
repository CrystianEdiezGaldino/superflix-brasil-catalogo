
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TvChannel } from "@/types/tvChannel";
import ChannelHeader from './channel-components/ChannelHeader';
import ChannelPlayer from './channel-components/ChannelPlayer';
import ProgramInfo from './channel-components/ProgramInfo';
import ChannelDescription from './channel-components/ChannelDescription';

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
  // Use refs instead of state to avoid re-renders that would cause iframe refresh
  const isIframeLoadedRef = useRef(false);
  const [isProgramInfoVisible, setIsProgramInfoVisible] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle iframe load - only set it once to avoid refreshes
  const handleIframeLoad = () => {
    if (!isIframeLoadedRef.current) {
      isIframeLoadedRef.current = true;
    }
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

  const toggleProgramInfo = () => setIsProgramInfoVisible(!isProgramInfoVisible);

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
          <ChannelHeader 
            channel={channel} 
            onClose={onClose}
            isProgramInfoVisible={isProgramInfoVisible}
            toggleProgramInfo={toggleProgramInfo}
          />

          <div className="w-full">
            <ChannelPlayer
              channel={channel}
              isIframeLoadedRef={isIframeLoadedRef}
              iframeRef={iframeRef}
              handleIframeLoad={handleIframeLoad}
              hasAccess={hasAccess}
            />
          </div>

          <div className="p-5">
            <ProgramInfo 
              isVisible={isProgramInfoVisible} 
              programs={currentPrograms} 
            />
            
            <ChannelDescription channel={channel} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(TvChannelModal);

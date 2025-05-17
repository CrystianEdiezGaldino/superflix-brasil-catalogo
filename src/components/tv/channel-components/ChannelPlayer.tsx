
import React, { useRef } from 'react';
import { TvChannel } from "@/types/tvChannel";

interface ChannelPlayerProps {
  channel: TvChannel;
  isIframeLoadedRef: React.MutableRefObject<boolean>;
  iframeRef: React.MutableRefObject<HTMLIFrameElement | null>;
  handleIframeLoad: () => void;
  hasAccess: boolean;
}

const ChannelPlayer = ({ 
  channel, 
  isIframeLoadedRef, 
  iframeRef, 
  handleIframeLoad, 
  hasAccess 
}: ChannelPlayerProps) => {
  
  if (!hasAccess) {
    return (
      <div className="aspect-video w-full bg-gray-900/80 flex items-center justify-center">
        <div className="text-center p-8 max-w-lg">
          <div className="bg-netflix-red/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="text-netflix-red" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
              <polyline points="17 2 12 7 7 2"></polyline>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Conteúdo Exclusivo</h3>
          <p className="text-gray-300 mb-6">
            Este canal é exclusivo para assinantes. Assine agora para ter acesso ilimitado a todos os canais.
          </p>
          <button 
            className="bg-netflix-red hover:bg-red-700 px-8 py-2 text-white font-medium rounded"
            onClick={() => window.location.href = '/subscribe'}
          >
            Ver planos
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="aspect-video w-full bg-black relative">
      {!isIframeLoadedRef.current && (
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
        style={{ opacity: isIframeLoadedRef.current ? 1 : 0 }}
        title={`${channel.name} - TV ao vivo`}
      />
    </div>
  );
};

export default ChannelPlayer;

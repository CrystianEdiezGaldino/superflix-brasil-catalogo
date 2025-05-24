declare global {
  interface Window {
    chrome: {
      cast: any;
    };
  }
}

export const initializeCast = () => {
  return new Promise<void>((resolve) => {
    // Verifica se o navegador suporta casting
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      resolve();
    } else {
      resolve(); // Resolve mesmo se não tiver suporte, pois o botão será desabilitado
    }
  });
};

export const castToTV = async (videoUrl: string) => {
  try {
    // Tenta usar a API nativa do navegador primeiro
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "browser",
        },
      });
      
      // Cria um elemento de vídeo para transmitir
      const video = document.createElement('video');
      video.src = videoUrl;
      video.autoplay = true;
      
      // Inicia a transmissão
      const mediaStream = video.captureStream();
      stream.getVideoTracks()[0].applyConstraints({
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      });
      
      return stream;
    }
    
    // Fallback para Chrome Cast se disponível
    if (window.chrome?.cast) {
      const session = await new Promise<any>((resolve, reject) => {
        window.chrome.cast.requestSession(
          (session: any) => resolve(session),
          (error: any) => reject(error)
        );
      });

      const mediaInfo = new window.chrome.cast.media.MediaInfo(videoUrl, 'video/mp4');
      const request = new window.chrome.cast.media.LoadRequest(mediaInfo);

      return session.loadMedia(request);
    }
    
    throw new Error('Nenhum método de cast disponível');
  } catch (error) {
    console.error('Erro ao iniciar cast:', error);
    throw error;
  }
}; 
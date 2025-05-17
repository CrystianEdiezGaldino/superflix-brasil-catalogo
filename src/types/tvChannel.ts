
export interface TvChannel {
  id: string;
  name: string;
  logo?: string;
  logoUrl?: string;
  category: string;
  description: string;
  iframeUrl: string;
}

// Helper functions to validate TvChannel objects
export const isTvChannel = (obj: any): obj is TvChannel => {
  return (
    obj !== undefined &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.iframeUrl === 'string'
  );
};

export const validateTvChannel = (channel: any): TvChannel | null => {
  if (isTvChannel(channel)) {
    return channel;
  }
  return null;
};

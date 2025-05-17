
export interface TvChannel {
  id: string;
  name: string;
  logo?: string;
  embedUrl: string;
  category: string;
}

// Helper functions to validate TvChannel objects
export const isTvChannel = (obj: any): obj is TvChannel => {
  return (
    obj !== undefined &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.embedUrl === 'string' &&
    typeof obj.category === 'string'
  );
};

export const validateTvChannel = (channel: any): TvChannel | null => {
  if (isTvChannel(channel)) {
    return channel;
  }
  return null;
};

import { useEffect } from 'react';

interface SuperFlixPlayerOptions {
  transparent?: boolean;
  noLink?: boolean;
  noEpList?: boolean;
  color?: string;
  noBackground?: boolean;
}

interface SuperFlixPlayerProps {
  type: 'filme' | 'serie';
  imdb: string;
  season?: number;
  episode?: number;
  options?: SuperFlixPlayerOptions;
}

const SuperFlixPlayer = ({ type, imdb, season, episode, options = {} }: SuperFlixPlayerProps) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://superflixapi.fyi/player.js';
    script.async = true;
    //teste
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const optionsString = Object.entries(options)
    .filter(([_, value]) => value)
    .map(([key]) => `#${key}`)
    .join('');

  const baseUrl = 'https://superflixapi.fyi';
  const seasonStr = type === 'serie' ? `/${season}` : '';
  const episodeStr = type === 'serie' ? `/${episode}` : '';
  
  const playerUrl = `${baseUrl}/${type}/${imdb}${seasonStr}${episodeStr}${optionsString}`;

  return (
    <div id="SuperFlixAPIContainerVideo" className="w-full bg-black rounded-lg overflow-hidden">
      <div className="w-full aspect-video">
        <iframe
          src={playerUrl}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
};

export default SuperFlixPlayer;


import { useEffect } from 'react';

interface SuperFlixPlayerProps {
  type: 'serie' | 'filme';
  imdb: string;
  season?: string;
  episode?: string;
  options?: {
    noEpList?: boolean;
    color?: string;
    noLink?: boolean;
    transparent?: boolean;
    noBackground?: boolean;
  };
}

const SuperFlixPlayer = ({ type, imdb, season = '1', episode = '1', options = {} }: SuperFlixPlayerProps) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      var type = "${type}";
      var imdb = "${imdb}";
      var season = "${season}";
      var episode = "${episode}";
      SuperFlixAPIPluginJS(type, imdb, season, episode);
      function SuperFlixAPIPluginJS(type, imdb, season, episode){
        if (type == "filme") { season=""; episode=""; }
        var frame = document.getElementById('SuperFlixAPIContainerVideo');
        var options = "${Object.entries(options)
          .filter(([_, value]) => value)
          .map(([key]) => `#${key}`)
          .join('')}";
        frame.innerHTML = '<iframe src="https://superflixapi.fyi/'+type+'/'+imdb+'/'+season+'/'+episode+options+'" style="width:100%;height:600px;border:none;"></iframe>';
      }
    `;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [type, imdb, season, episode, options]);

  return <div id="SuperFlixAPIContainerVideo" />;
};

export default SuperFlixPlayer;

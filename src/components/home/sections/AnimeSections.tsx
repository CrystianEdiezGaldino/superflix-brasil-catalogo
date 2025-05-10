
import { MediaItem } from "@/types/movie";
import MediaSectionLoader from "../MediaSectionLoader";

interface AnimeSectionsProps {
  anime: MediaItem[];
  topRatedAnime: MediaItem[];
  recentAnimes?: MediaItem[];
  trendingAnime?: MediaItem[];
}

const AnimeSections = ({
  anime,
  topRatedAnime,
  recentAnimes = [],
  trendingAnime = []
}: AnimeSectionsProps) => {
  return (
    <>
      {recentAnimes.length > 0 && (
        <MediaSectionLoader 
          title="Anime em Alta" 
          medias={recentAnimes}
          sectionId="recentAnimes"
          initialLoadCount={60}
        />
      )}
      
      <MediaSectionLoader 
        title="Animes Populares" 
        medias={anime}
        sectionId="anime"
        initialLoadCount={60}
      />
      
      <MediaSectionLoader 
        title="Animes Bem Avaliados" 
        medias={topRatedAnime}
        sectionId="topRatedAnime"
        initialLoadCount={60}
      />
      
      {trendingAnime.length > 0 && (
        <MediaSectionLoader 
          title="Animes em Alta no Brasil" 
          medias={trendingAnime}
          sectionId="trendingAnime"
          initialLoadCount={60}
        />
      )}
    </>
  );
};

export default AnimeSections;


import { MediaItem } from "@/types/movie";
import MediaSectionLoader from "../MediaSectionLoader";

interface SeriesSectionsProps {
  series: MediaItem[];
  popularSeries?: MediaItem[];
  awardWinningSeries?: MediaItem[];
  documentarySeries?: MediaItem[];
  crimeSeries?: MediaItem[];
  mysterySeries?: MediaItem[];
  realitySeries?: MediaItem[];
  talkShows?: MediaItem[];
  netflixOriginals?: MediaItem[];
  primeOriginals?: MediaItem[];
  hboOriginals?: MediaItem[];
  disneyOriginals?: MediaItem[];
}

const SeriesSections = ({
  series,
  popularSeries = [],
  awardWinningSeries = [],
  documentarySeries = [],
  crimeSeries = [],
  mysterySeries = [],
  realitySeries = [],
  talkShows = [],
  netflixOriginals = [],
  primeOriginals = [],
  hboOriginals = [],
  disneyOriginals = []
}: SeriesSectionsProps) => {
  return (
    <>
      {/* Main series sections */}
      {popularSeries.length > 0 && (
        <MediaSectionLoader 
          title="Séries Populares" 
          medias={popularSeries}
          sectionId="popularSeries"
        />
      )}
      
      <MediaSectionLoader 
        title="Séries e Programas de TV" 
        medias={series}
        sectionId="series"
      />
      
      {/* Streaming platform originals */}
      {netflixOriginals.length > 0 && (
        <MediaSectionLoader 
          title="Netflix Originals" 
          medias={netflixOriginals}
          sectionId="netflixOriginals"
        />
      )}
      
      {primeOriginals.length > 0 && (
        <MediaSectionLoader 
          title="Amazon Prime Originals" 
          medias={primeOriginals}
          sectionId="primeOriginals"
        />
      )}
      
      {hboOriginals.length > 0 && (
        <MediaSectionLoader 
          title="HBO Max Originals" 
          medias={hboOriginals}
          sectionId="hboOriginals"
        />
      )}
      
      {disneyOriginals.length > 0 && (
        <MediaSectionLoader 
          title="Disney+ Originals" 
          medias={disneyOriginals}
          sectionId="disneyOriginals"
        />
      )}
      
      {/* Additional series sections */}
      {awardWinningSeries.length > 0 && (
        <MediaSectionLoader 
          title="Séries Premiadas" 
          medias={awardWinningSeries}
          sectionId="awardWinningSeries"
        />
      )}
      
      {documentarySeries.length > 0 && (
        <MediaSectionLoader 
          title="Séries Documentais" 
          medias={documentarySeries}
          sectionId="documentarySeries"
        />
      )}
      
      {crimeSeries.length > 0 && (
        <MediaSectionLoader 
          title="Séries de Crime" 
          medias={crimeSeries}
          sectionId="crimeSeries"
        />
      )}
      
      {mysterySeries.length > 0 && (
        <MediaSectionLoader 
          title="Séries de Mistério" 
          medias={mysterySeries}
          sectionId="mysterySeries"
        />
      )}
      
      {realitySeries.length > 0 && (
        <MediaSectionLoader 
          title="Reality Shows" 
          medias={realitySeries}
          sectionId="realitySeries"
        />
      )}
      
      {talkShows.length > 0 && (
        <MediaSectionLoader 
          title="Talk Shows" 
          medias={talkShows}
          sectionId="talkShows"
        />
      )}
    </>
  );
};

export default SeriesSections;

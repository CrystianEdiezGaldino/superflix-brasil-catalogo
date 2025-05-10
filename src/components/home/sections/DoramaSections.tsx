
import { MediaItem } from "@/types/movie";
import MediaSectionLoader from "../MediaSectionLoader";

interface DoramaSectionsProps {
  doramas: MediaItem[];
  koreanDramas?: MediaItem[];
  japaneseDramas?: MediaItem[];
  chineseDramas?: MediaItem[];
  netflixDoramas?: MediaItem[];
}

const DoramaSections = ({
  doramas,
  koreanDramas = [],
  japaneseDramas = [],
  chineseDramas = [],
  netflixDoramas = []
}: DoramaSectionsProps) => {
  return (
    <>
      <MediaSectionLoader 
        title="Doramas Coreanos" 
        medias={doramas}
        sectionId="doramas"
      />
      
      {koreanDramas.length > 0 && (
        <MediaSectionLoader 
          title="Doramas Coreanos" 
          medias={koreanDramas}
          sectionId="koreanDramas"
        />
      )}
      
      {japaneseDramas.length > 0 && (
        <MediaSectionLoader 
          title="Doramas Japoneses" 
          medias={japaneseDramas}
          sectionId="japaneseDramas"
        />
      )}
      
      {chineseDramas.length > 0 && (
        <MediaSectionLoader 
          title="Doramas Chineses" 
          medias={chineseDramas}
          sectionId="chineseDramas"
        />
      )}
      
      {netflixDoramas.length > 0 && (
        <MediaSectionLoader 
          title="Doramas Netflix" 
          medias={netflixDoramas}
          sectionId="netflixDoramas"
        />
      )}
    </>
  );
};

export default DoramaSections;

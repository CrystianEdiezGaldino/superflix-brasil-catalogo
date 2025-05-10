
import { MediaItem } from "@/types/movie";
import MediaSectionLoader from "../MediaSectionLoader";

interface DoramaSectionsProps {
  doramas: MediaItem[];
  koreanDramas?: MediaItem[];
  japaneseDramas?: MediaItem[];
  chineseDramas?: MediaItem[];
  netflixDoramas?: MediaItem[];
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

const DoramaSections = ({
  doramas,
  koreanDramas = [],
  japaneseDramas = [],
  chineseDramas = [],
  netflixDoramas = [],
  onLoadMore = () => {},
  isLoading = false,
  hasMore = false
}: DoramaSectionsProps) => {
  // Função padrão para sessões sem paginação real
  const noop = () => {};
  
  // Funções específicas para cada seção
  const handleLoadMoreDoramas = () => {
    onLoadMore();
    console.log("Carregando mais doramas gerais");
  };
  
  const handleLoadMoreKoreanDramas = () => {
    onLoadMore();
    console.log("Carregando mais doramas coreanos");
  };
  
  const handleLoadMoreJapaneseDramas = () => {
    onLoadMore();
    console.log("Carregando mais doramas japoneses");
  };
  
  const handleLoadMoreChineseDramas = () => {
    onLoadMore();
    console.log("Carregando mais doramas chineses");
  };
  
  const handleLoadMoreNetflixDoramas = () => {
    onLoadMore();
    console.log("Carregando mais doramas Netflix");
  };
  
  return (
    <div className="dorama-sections-container">
      <MediaSectionLoader 
        title="Doramas" 
        medias={doramas}
        sectionId="doramas"
        onLoadMore={handleLoadMoreDoramas}
        isLoading={isLoading}
        hasMore={hasMore}
      />
      
      {koreanDramas.length > 0 && (
        <MediaSectionLoader 
          title="Doramas Coreanos" 
          medias={koreanDramas}
          sectionId="koreanDramas"
          onLoadMore={handleLoadMoreKoreanDramas}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      )}
      
      {japaneseDramas.length > 0 && (
        <MediaSectionLoader 
          title="Doramas Japoneses" 
          medias={japaneseDramas}
          sectionId="japaneseDramas"
          onLoadMore={handleLoadMoreDoramas}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      )}
      
      {chineseDramas.length > 0 && (
        <MediaSectionLoader 
          title="Doramas Chineses" 
          medias={chineseDramas}
          sectionId="chineseDramas"
          onLoadMore={handleLoadMoreDoramas}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      )}
      
      {netflixDoramas.length > 0 && (
        <MediaSectionLoader 
          title="Doramas Netflix" 
          medias={netflixDoramas}
          sectionId="netflixDoramas"
          onLoadMore={handleLoadMoreDoramas}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      )}
    </div>
  );
};

export default DoramaSections;

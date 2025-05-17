import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import SearchResults from "@/components/home/SearchResults";
import { useMediaSearch } from "@/hooks/useMediaSearch";
import Navbar from "@/components/Navbar";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const { 
    results, 
    isLoading, 
    hasMore, 
    searchMedia 
  } = useMediaSearch();

  // Filtra apenas os resultados que possuem imagem
  const filteredResults = results.filter(media => media.poster_path);

  useEffect(() => {
    if (query) {
      searchMedia(query, 1);
      setPage(1);
    }
  }, [query]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    await searchMedia(query, nextPage);
    setPage(nextPage);
    
    // Scroll suave para o final da página após carregar novos conteúdos
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20" ref={resultsRef}>
        <SearchResults
          results={filteredResults}
          isSearching={isLoading}
          loadMoreResults={handleLoadMore}
          hasMore={hasMore}
        />
      </div>
    </>
  );
};

export default Search; 
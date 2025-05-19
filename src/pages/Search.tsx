import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SearchResults from "@/components/home/SearchResults";
import { useMediaSearch } from "@/hooks/useMediaSearch";
import Navbar from "@/components/Navbar";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [page, setPage] = useState(1);
  const [focusedItem, setFocusedItem] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
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

  // Navegação por controle de TV
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const itemsPerRow = window.innerWidth >= 1280 ? 6 : 
                         window.innerWidth >= 1024 ? 5 : 
                         window.innerWidth >= 768 ? 4 : 
                         window.innerWidth >= 640 ? 3 : 2;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          setFocusedItem(prev => Math.min(prev + 1, filteredResults.length - 1));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedItem(prev => Math.max(prev - 1, 0));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedItem(prev => Math.min(prev + itemsPerRow, filteredResults.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedItem(prev => Math.max(prev - itemsPerRow, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredResults[focusedItem]) {
            const media = filteredResults[focusedItem];
            handleMediaClick(media);
          }
          break;
        case 'Backspace':
          e.preventDefault();
          window.history.back();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedItem, filteredResults]);

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

  const handleMediaClick = (media: any) => {
    if (media.media_type === 'movie') {
      navigate(`/filme/${media.id}`);
    } else if (media.media_type === 'tv') {
      if (media.original_language === 'ko') {
        navigate(`/dorama/${media.id}`);
      } else if (media.original_language === 'ja') {
        navigate(`/anime/${media.id}`);
      } else {
        navigate(`/serie/${media.id}`);
      }
    }
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
          focusedItem={focusedItem}
          onMediaClick={handleMediaClick}
        />
      </div>
    </>
  );
};

export default Search; 
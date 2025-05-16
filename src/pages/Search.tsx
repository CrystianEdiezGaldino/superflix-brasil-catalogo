import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchResults from "@/components/home/SearchResults";
import { useMediaSearch } from "@/hooks/useMediaSearch";
import Navbar from "@/components/Navbar";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [page, setPage] = useState(1);
  
  const { 
    results, 
    isLoading, 
    hasMore, 
    searchMedia 
  } = useMediaSearch();

  useEffect(() => {
    if (query) {
      searchMedia(query, 1);
      setPage(1);
    }
  }, [query]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    searchMedia(query, nextPage);
    setPage(nextPage);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20">
        <SearchResults
          results={results}
          isSearching={isLoading}
          loadMoreResults={handleLoadMore}
          hasMore={hasMore}
        />
      </div>
    </>
  );
};

export default Search; 

import { useState } from "react";

export const useKidsPagination = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMore = () => {
    setPage(prev => prev + 1);
    setIsLoadingMore(true);
  };

  return {
    page,
    hasMore,
    isLoadingMore,
    loadMore,
    setHasMore,
    setIsLoadingMore
  };
};

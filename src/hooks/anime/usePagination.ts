
import { useState } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  itemsPerPage?: number;
  totalItems?: number;
}

export const usePagination = ({
  initialPage = 1,
  itemsPerPage = 20,
  totalItems = 0
}: UsePaginationProps = {}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [displayedItems, setDisplayedItems] = useState<any[]>([]);
  
  // Load more items from existing data
  const loadMoreFromExisting = (allItems: any[], startIndex: number) => {
    const endIndex = startIndex + itemsPerPage;
    const newItems = allItems.slice(startIndex, endIndex);
    setDisplayedItems(prev => [...prev, ...newItems]);
    setHasMore(endIndex < allItems.length);
  };
  
  // Reset pagination
  const resetPagination = () => {
    setCurrentPage(initialPage);
    setIsLoadingMore(false);
    setHasMore(true);
    setDisplayedItems([]);
  };
  
  // Initialize displayed items with first batch
  const initializeItems = (items: any[]) => {
    const initialItems = items.slice(0, itemsPerPage);
    setDisplayedItems(initialItems);
    setHasMore(items.length > itemsPerPage);
  };

  return {
    currentPage,
    setCurrentPage,
    isLoadingMore,
    setIsLoadingMore,
    hasMore,
    setHasMore,
    displayedItems,
    setDisplayedItems,
    loadMoreFromExisting,
    resetPagination,
    initializeItems,
    itemsPerPage
  };
};

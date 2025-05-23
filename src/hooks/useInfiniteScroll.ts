
import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  enabled?: boolean;
}

export const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 0.5,
  root = null,
  rootMargin = '100px',
  enabled = true
}: UseInfiniteScrollProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingTriggeredRef = useRef(false);
  
  const lastElementRef = useCallback((node: HTMLElement | null) => {
    // Do not observe if loading, has no more items, or is disabled
    if (isLoading || !hasMore || !enabled) return;
    
    // Disconnect previous observer
    if (observer.current) {
      observer.current.disconnect();
    }
    
    // Reset loading triggered flag when setting up new observer
    loadingTriggeredRef.current = false;
    
    // Create new observer
    observer.current = new IntersectionObserver(entries => {
      // Only trigger once per observation
      if (entries[0].isIntersecting && hasMore && !loadingTriggeredRef.current) {
        console.log("Infinite scroll triggered, loading more items");
        loadingTriggeredRef.current = true;
        onLoadMore();
      }
    }, {
      root,
      rootMargin,
      threshold
    });
    
    // Start observing new node
    if (node) {
      observer.current.observe(node);
    }
  }, [isLoading, hasMore, onLoadMore, root, rootMargin, threshold, enabled]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  // If hasMore changes to true, reset loading triggered
  useEffect(() => {
    if (hasMore) {
      loadingTriggeredRef.current = false;
    }
  }, [hasMore]);

  return lastElementRef;
};

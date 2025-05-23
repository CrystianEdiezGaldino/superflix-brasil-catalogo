
import { useEffect, useRef, useState, useCallback } from "react";

interface UseIntersectionObserverProps {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  onIntersect?: () => void;
  enabled?: boolean;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = ({
  threshold = 0.1,
  root = null,
  rootMargin = "0px",
  onIntersect,
  enabled = true,
  triggerOnce = false
}: UseIntersectionObserverProps = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [wasTriggered, setWasTriggered] = useState(false);
  const observedRef = useRef<HTMLElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // Create callback ref
  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (!enabled) return;
      
      if (triggerOnce && wasTriggered) return;
      
      // Disconnect existing observer
      if (observer.current) {
        observer.current.disconnect();
      }
      
      // Save ref
      observedRef.current = node;
      
      // Skip if no element
      if (!node) return;
      
      // Create new observer
      observer.current = new IntersectionObserver(
        ([entry]) => {
          setIsIntersecting(entry.isIntersecting);
          
          if (entry.isIntersecting) {
            if (onIntersect) {
              onIntersect();
              if (triggerOnce) {
                setWasTriggered(true);
              }
            }
          }
        },
        { threshold, root, rootMargin }
      );
      
      // Start observing
      observer.current.observe(node);
    },
    [threshold, root, rootMargin, onIntersect, enabled, triggerOnce, wasTriggered]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return { ref, isIntersecting };
};

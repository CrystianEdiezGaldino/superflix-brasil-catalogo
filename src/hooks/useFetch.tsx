
import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: undefined,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      setState(prev => ({ ...prev, isLoading: true }));

      try {
        // In a real app, this would make an actual API call
        // For now, we'll just simulate data by returning an empty array
        // which is compatible with the way the data is used in the application
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data - in a real app you'd use:
        // const response = await fetch(url, { signal: controller.signal });
        // const result = await response.json();
        
        const mockData = [] as unknown as T;

        if (isMounted) {
          setState({
            data: mockData,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: undefined,
            isLoading: false,
            error: error instanceof Error ? error : new Error('An unknown error occurred'),
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [url]);

  return state;
}

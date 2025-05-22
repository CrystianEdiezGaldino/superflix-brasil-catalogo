
import { useState, useEffect } from "react";
import { MediaItem } from "@/types/movie";

export interface SectionDataItem {
  items: MediaItem[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
}

export type SectionDataState = Record<string, SectionDataItem>;

export const useSectionData = (initialMediaData: Record<string, MediaItem[]>) => {
  const [sectionData, setSectionData] = useState<SectionDataState>({});
  
  // Initialize section data based on initial media data
  useEffect(() => {
    const updateSectionData = (key: string, data: MediaItem[] | undefined) => {
      if (data && data.length > 0) {
        setSectionData(prev => {
          // Only update if the data is different
          if (JSON.stringify(prev[key]?.items) === JSON.stringify(data)) {
            return prev;
          }
          return {
            ...prev,
            [key]: { items: data, page: 1, hasMore: true, isLoading: false }
          };
        });
      }
    };

    // Update all sections from the provided media data
    Object.entries(initialMediaData).forEach(([key, data]) => {
      updateSectionData(key, Array.isArray(data) ? data : []);
    });
  }, [initialMediaData]);

  // Function to load more items for a specific section
  const loadMoreForSection = async (sectionId: string, sourceData: MediaItem[], limit = 20) => {
    // Update section loading state
    setSectionData(prev => ({
      ...prev,
      [sectionId]: { 
        ...prev[sectionId],
        isLoading: true
      }
    }));
    
    try {
      // Simulate API request delay (in a real app, this would be a real API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get the current section data
      const currentSectionData = sectionData[sectionId];
      if (!currentSectionData) return;
      
      // Calculate start and end indices for pagination
      const nextPage = currentSectionData.page + 1;
      
      // Get next batch of items (simulating pagination)
      const moreItems = sourceData
        .filter(item => !currentSectionData.items.some(existing => existing.id === item.id))
        .slice(0, limit);
      
      const hasMoreItems = moreItems.length > 0;
      
      // Update section data with new items and page
      setSectionData(prev => ({
        ...prev,
        [sectionId]: {
          items: [...prev[sectionId].items, ...moreItems],
          page: nextPage,
          hasMore: hasMoreItems,
          isLoading: false
        }
      }));
      
    } catch (error) {
      console.error(`Error loading more items for section ${sectionId}:`, error);
    } finally {
      // Reset loading state
      setSectionData(prev => ({
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          isLoading: false
        }
      }));
    }
  };

  return {
    sectionData,
    setSectionData,
    loadMoreForSection,
    isLoadingMore: Object.values(sectionData).some(section => section.isLoading),
  };
};

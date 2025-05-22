
import { useCallback } from "react";
import { SectionDataState } from "./useSectionData";

type SectionId = 'anime' | 'topRatedAnime' | 'recentAnimes' | string;

export const useSectionPagination = (
  sectionData: SectionDataState,
  handleLoadMoreSection: (sectionId: string) => void
) => {
  // Create fetch functions for specific sections
  const fetchNextPage = {
    anime: useCallback(() => handleLoadMoreSection('anime'), [handleLoadMoreSection]),
    topRated: useCallback(() => handleLoadMoreSection('topRatedAnime'), [handleLoadMoreSection]),
    recent: useCallback(() => handleLoadMoreSection('recentAnimes'), [handleLoadMoreSection]),
  };

  // Check if more data is available for sections
  const hasNextPage = {
    anime: sectionData?.anime?.hasMore || false,
    topRated: sectionData?.topRatedAnime?.hasMore || false,
    recent: sectionData?.recentAnimes?.hasMore || false,
  };

  // Check if sections are currently fetching data
  const isFetchingNextPage = {
    anime: sectionData?.anime?.isLoading || false,
    topRated: sectionData?.topRatedAnime?.isLoading || false,
    recent: sectionData?.recentAnimes?.isLoading || false,
  };

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
};

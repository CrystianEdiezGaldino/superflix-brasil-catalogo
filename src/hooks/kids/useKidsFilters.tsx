
import { useState } from "react";

export const useKidsFilters = () => {
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setIsSearching(!!query);
    setIsFiltering(!!yearFilter || !!ratingFilter);
  };

  const handleYearFilterChange = (year: string) => {
    setYearFilter(year);
    setIsFiltering(!!year || !!ratingFilter);
  };

  const handleRatingFilterChange = (rating: string) => {
    setRatingFilter(rating);
    setIsFiltering(!!yearFilter || !!rating);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setYearFilter("");
    setRatingFilter("");
    setIsSearching(false);
    setIsFiltering(false);
  };

  return {
    yearFilter,
    ratingFilter,
    searchQuery,
    isSearching,
    isFiltering,
    handleSearchChange,
    handleYearFilterChange,
    handleRatingFilterChange,
    resetFilters
  };
};

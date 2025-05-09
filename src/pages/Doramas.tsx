
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useDoramas } from "@/hooks/useDoramas";
import DoramaSearchFilters from "@/components/doramas/DoramaSearchFilters";
import DoramaSection from "@/components/doramas/DoramaSection";
import DoramasGrid from "@/components/doramas/DoramasGrid";

const Doramas = () => {
  const {
    doramas,
    topRatedDoramas,
    popularDoramas,
    hasMore,
    yearFilter,
    genreFilter,
    isSearching,
    isFiltering,
    isLoadingInitial,
    isLoadingPopular,
    isLoadingTopRated,
    handleSearch,
    loadMoreDoramas,
    setYearFilter,
    setGenreFilter,
    resetFilters
  } = useDoramas();

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={handleSearch} />
      
      <div className="pt-24 pb-10 px-4 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Doramas Coreanos</h1>
        
        {/* Search and Filter Section */}
        <DoramaSearchFilters 
          onSearch={handleSearch}
          onYearFilterChange={setYearFilter}
          onGenreFilterChange={setGenreFilter}
          isSearching={isSearching}
          yearFilter={yearFilter}
          genreFilter={genreFilter}
        />
        
        {/* Featured Doramas - Top Rated */}
        <DoramaSection 
          title="Doramas Mais Bem Avaliados"
          doramas={topRatedDoramas}
          isLoading={isLoadingTopRated}
        />
        
        {/* Popular Doramas */}
        <DoramaSection 
          title="Doramas Populares"
          doramas={popularDoramas}
          isLoading={isLoadingPopular}
        />
        
        {/* All Doramas Grid */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Todos os Doramas</h2>
          <DoramasGrid 
            doramas={doramas}
            isLoading={isLoadingInitial}
            hasMore={hasMore}
            isSearching={isSearching}
            isFiltering={isFiltering}
            onLoadMore={loadMoreDoramas}
            onResetFilters={resetFilters}
          />
        </section>
      </div>
    </div>
  );
};

export default Doramas;

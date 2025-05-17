import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import MediaFilters from "./MediaFilters";
import MediaGrid from "./MediaGrid";
import MediaSection from "@/components/MediaSection";
import { Button } from "@/components/ui/button";
import { MediaItem } from "@/types/movie";
import { TrendingUp, Star, Clock, Filter } from "lucide-react";
import SearchBar from "../navbar/SearchBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

interface MediaViewProps {
  title: string;
  type: "movie" | "tv" | "anime" | "dorama";
  mediaItems: MediaItem[];
  trendingItems?: MediaItem[];
  topRatedItems?: MediaItem[];
  recentItems?: MediaItem[];
  popularItems?: MediaItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  isFiltering: boolean;
  isSearching: boolean;
  page: number;
  yearFilter?: string;
  ratingFilter?: string;
  searchQuery?: string;
  onSearch?: (query: string) => void;
  onYearFilterChange?: (year: string) => void;
  onRatingFilterChange?: (rating: string) => void;
  onLoadMore?: () => void;
  onResetFilters?: () => void;
  onMediaClick: (media: MediaItem) => void;
  children?: React.ReactNode;
  focusedSection?: number;
  focusedItem?: number;
}

const MediaView = ({
  title,
  type,
  mediaItems,
  trendingItems = [],
  topRatedItems = [],
  recentItems = [],
  popularItems = [],
  isLoading,
  isLoadingMore,
  hasMore,
  isFiltering,
  isSearching,
  page,
  yearFilter = "",
  ratingFilter = "",
  searchQuery = "",
  onSearch,
  onYearFilterChange,
  onRatingFilterChange,
  onLoadMore,
  onResetFilters,
  onMediaClick,
  children,
  focusedSection = 0,
  focusedItem = 0
}: MediaViewProps) => {
  const [currentFocusedSection, setCurrentFocusedSection] = useState(focusedSection);
  const [currentFocusedItem, setCurrentFocusedItem] = useState(focusedItem);
  const [showFilters, setShowFilters] = useState(false);
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const yearFilterRef = useRef<HTMLSelectElement>(null);
  const ratingFilterRef = useRef<HTMLSelectElement>(null);
  const resetFilterRef = useRef<HTMLButtonElement>(null);

  // Helper function to determine content section title based on type
  const getContentTypeTitle = (contentType: string) => {
    switch (contentType) {
      case "movie": return "Filmes";
      case "tv": return "Séries";
      case "anime": return "Animes";
      case "dorama": return "Doramas";
      default: return "Conteúdo";
    }
  };

  // Array de sessões para navegação por foco
  const sections = [
    { items: trendingItems, title: `Tendências em ${getContentTypeTitle(type)}` },
    { items: topRatedItems, title: `${getContentTypeTitle(type)} Mais Bem Avaliados` },
    { items: recentItems, title: `${getContentTypeTitle(type)} Recentes` }
  ];

  // Efeito para navegação por controle de TV
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Tab":
          e.preventDefault();
          if (focusedElement === null) {
            setFocusedElement('search');
            searchRef.current?.focus();
          } else if (focusedElement === 'search') {
            setFocusedElement('yearFilter');
            yearFilterRef.current?.focus();
          } else if (focusedElement === 'yearFilter') {
            setFocusedElement('ratingFilter');
            ratingFilterRef.current?.focus();
          } else if (focusedElement === 'ratingFilter') {
            setFocusedElement('resetFilter');
            resetFilterRef.current?.focus();
          } else {
            setFocusedElement(null);
          }
          break;

        case "ArrowDown":
          e.preventDefault();
          if (focusedElement === 'search' || focusedElement === 'yearFilter' || 
              focusedElement === 'ratingFilter' || focusedElement === 'resetFilter') {
            setFocusedElement(null);
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          if (focusedElement === null) {
            setFocusedElement('search');
            searchRef.current?.focus();
          }
          break;

        case "Enter":
          e.preventDefault();
          if (focusedElement === 'resetFilter') {
            onResetFilters?.();
          }
          break;

        case "Backspace":
          e.preventDefault();
          if (focusedElement === 'search') {
            setFocusedElement(null);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedElement, onResetFilters]);

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">{title}</h1>
        
        {/* Conteúdo de destaque (renderizado condicionalmente) */}
        {!isSearching && !isFiltering && children}
        
        {/* Seções de conteúdo - ocultadas durante a busca */}
        <div className={isSearching ? "hidden" : ""}>
          {sections.map((section, idx) => (
            section.items && section.items.length > 0 && (
              <MediaSection
                key={section.title}
                title={section.title}
                medias={section.items}
                onMediaClick={onMediaClick}
                focusedItem={currentFocusedSection === idx ? currentFocusedItem : -1}
                onFocusChange={(index) => {
                  setCurrentFocusedItem(index);
                  setCurrentFocusedSection(idx);
                }}
              />
            )
          ))}
        </div>
        
        {/* Grade de conteúdo completa */}
        <div className="mt-8">
          <MediaGrid 
            mediaItems={mediaItems}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            isSearching={isSearching}
            isFiltering={isFiltering}
            onLoadMore={onLoadMore}
            onResetFilters={onResetFilters}
            onMediaClick={onMediaClick}
            focusedItem={currentFocusedSection === sections.length ? currentFocusedItem : -1}
          />
        </div>
      </div>
    </div>
  );
};

export default MediaView; 
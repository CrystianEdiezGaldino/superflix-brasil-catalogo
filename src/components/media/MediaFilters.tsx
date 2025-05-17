
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter } from "lucide-react";

interface MediaFiltersProps {
  searchQuery: string;
  yearFilter: string;
  ratingFilter: string;
  isSearching: boolean;
  onSearch: (query: string) => void;
  onYearFilterChange: (year: string) => void;
  onRatingFilterChange: (rating: string) => void;
}

const MediaFilters = ({
  searchQuery,
  yearFilter,
  ratingFilter,
  isSearching,
  onSearch,
  onYearFilterChange,
  onRatingFilterChange
}: MediaFiltersProps) => {
  // Estado local para o input de pesquisa
  const [localSearchQuery, setLocalSearchQuery] = React.useState(searchQuery);

  // Efeito para sincronizar o estado local com a prop
  React.useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Gera as opções de anos
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let year = currentYear; year >= 1950; year--) {
      years.push(year);
    }
    
    return years;
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchQuery);
  };

  const yearOptions = generateYearOptions();

  return (
    <div className="bg-black/40 p-6 rounded-lg mb-8 backdrop-blur-sm border border-gray-800">
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
          <Input 
            type="text" 
            placeholder="Pesquisar conteúdo..." 
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="bg-gray-900 border-gray-700 text-white"
          />
          <Button 
            type="submit"
            disabled={isSearching}
            className="bg-netflix-red hover:bg-red-700"
          >
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              <Search size={18} />
            )}
            <span className="ml-2 hidden md:inline">Pesquisar</span>
          </Button>
        </form>
        
        <div className="flex gap-2 flex-wrap md:flex-nowrap">
          <Select value={yearFilter} onValueChange={onYearFilterChange}>
            <SelectTrigger className="w-[120px] bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700 text-white">
              <SelectItem value="all">Todos os anos</SelectItem>
              <ScrollArea className="h-[200px]">
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
          
          <Select value={ratingFilter} onValueChange={onRatingFilterChange}>
            <SelectTrigger className="w-[120px] bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Avaliação" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700 text-white">
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="8">8+ ⭐</SelectItem>
              <SelectItem value="7">7+ ⭐</SelectItem>
              <SelectItem value="6">6+ ⭐</SelectItem>
              <SelectItem value="5">5+ ⭐</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="border-gray-700 text-white flex gap-2">
            <Filter size={18} />
            <span className="hidden md:inline">Filtros</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MediaFilters;


import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter } from "lucide-react";
import { toast } from "sonner";

interface DoramaSearchFiltersProps {
  onSearch: (query: string) => void;
  onYearFilterChange: (year: string) => void;
  onGenreFilterChange: (genre: string) => void;
  isSearching: boolean;
  yearFilter: string;
  genreFilter: string;
}

const DoramaSearchFilters = ({
  onSearch,
  onYearFilterChange,
  onGenreFilterChange,
  isSearching,
  yearFilter,
  genreFilter
}: DoramaSearchFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Generate year options for filter
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let year = currentYear; year >= 2010; year--) {
      years.push(year);
    }
    
    return years;
  };

  // Years for the filter
  const yearOptions = generateYearOptions();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Digite algo para pesquisar");
      return;
    }
    onSearch(searchQuery);
  };

  return (
    <div className="bg-black/40 p-6 rounded-lg mb-8 backdrop-blur-sm border border-gray-800">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-1 gap-2">
          <Input 
            type="text" 
            placeholder="Pesquisar doramas..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-900 border-gray-700 text-white"
          />
          <Button 
            onClick={handleSearch} 
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
        </div>
        
        <div className="flex gap-2">
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
          
          <Select value={genreFilter} onValueChange={onGenreFilterChange}>
            <SelectTrigger className="w-[150px] bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700 text-white">
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="romance">Romance</SelectItem>
              <SelectItem value="comedy">Comédia</SelectItem>
              <SelectItem value="drama">Drama</SelectItem>
              <SelectItem value="action">Ação</SelectItem>
              <SelectItem value="thriller">Thriller</SelectItem>
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

export default DoramaSearchFilters;

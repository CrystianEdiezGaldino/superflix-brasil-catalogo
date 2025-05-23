
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Filter, Search, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

interface AnimeFiltersProps {
  onSearch: (query: string) => void;
  onFilterYear: (year: number) => void;
  onFilterRating: (rating: number) => void;
  onResetFilters: () => void;
  isFiltering: boolean;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

const AnimeFilters: React.FC<AnimeFiltersProps> = ({
  onSearch,
  onFilterYear,
  onFilterRating,
  onResetFilters,
  isFiltering
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = () => {
    onSearch(searchQuery.trim());
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedYear(0);
    setRating(0);
    onResetFilters();
  };

  const handleYearChange = (year: string) => {
    const yearValue = parseInt(year, 10);
    setSelectedYear(yearValue);
    onFilterYear(yearValue);
  };

  const handleRatingChange = (value: number[]) => {
    const ratingValue = value[0];
    setRating(ratingValue);
    onFilterRating(ratingValue);
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search bar */}
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Buscar animes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="bg-gray-800/50 border-gray-700 pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          {searchQuery && (
            <button
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200"
              onClick={() => {
                setSearchQuery('');
                onSearch('');
              }}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="bg-gray-800/50 hover:bg-gray-700"
            onClick={handleSearch}
          >
            <Search className="mr-2 h-4 w-4" /> Buscar
          </Button>

          {/* Filter button and sheet */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className={`${
                  isFiltering ? "bg-netflix-red text-white border-netflix-red" : "bg-gray-800/50 border-gray-700"
                }`}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtros
                {isFiltering && <span className="ml-2 bg-white text-netflix-red rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">!</span>}
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gray-900 text-white border-gray-800">
              <h3 className="text-lg font-bold mb-6">Filtros</h3>
              
              <div className="space-y-6">
                {/* Year filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ano de Lançamento</label>
                  <Select 
                    value={selectedYear.toString()} 
                    onValueChange={handleYearChange}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="0">Todos os anos</SelectItem>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating filter */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Nota mínima</label>
                    <span className="text-sm font-medium">{rating}</span>
                  </div>
                  <Slider
                    value={[rating]}
                    min={0}
                    max={10}
                    step={0.5}
                    onValueChange={handleRatingChange}
                    className="[&>[data-handle]]:bg-netflix-red"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>0</span>
                    <span>10</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-4">
                  <SheetClose asChild>
                    <Button variant="outline" className="flex-1">
                      Cancelar
                    </Button>
                  </SheetClose>
                  <Button 
                    className="flex-1 bg-netflix-red hover:bg-netflix-red/90"
                    onClick={handleReset}
                  >
                    Limpar
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {isFiltering && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Filtros aplicados</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleReset}
            className="h-7 text-xs hover:bg-netflix-red/20 text-netflix-red hover:text-white"
          >
            Limpar filtros <X className="ml-1 h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AnimeFilters;

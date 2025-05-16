
import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setQuery("");
      onSearch(""); // Clear search when closing
    }
  };

  useEffect(() => {
    // Focus input when search is opened
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isSearchOpen]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    // Automatically search as user types after a short delay
    if (newQuery.length > 2 || newQuery === "") {
      const timer = setTimeout(() => {
        onSearch(newQuery);
      }, 500);
      return () => clearTimeout(timer);
    }
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative">
      <div
        className={`flex items-center rounded-full overflow-hidden transition-all duration-300 
          ${isSearchOpen ? 'bg-black/50 border border-white/20 backdrop-blur-sm' : 'bg-transparent'}`}
        style={{ width: isSearchOpen ? "auto" : "40px" }}
      >
        {isSearchOpen && (
          <div className="relative">
            <Input
              ref={inputRef}
              type="search"
              placeholder="Títulos, pessoas, gêneros..."
              value={query}
              onChange={handleSearchInputChange}
              className="w-[180px] md:w-[220px] lg:w-[280px] bg-transparent border-none pl-4 pr-8 placeholder:text-gray-400 text-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}
        <Button
          type={isSearchOpen ? "submit" : "button"}
          onClick={!isSearchOpen ? toggleSearch : undefined}
          variant="ghost"
          size="icon"
          className={`text-white ${isSearchOpen ? 'hover:text-white' : 'hover:text-netflix-red'} transition-colors`}
        >
          <Search size={18} />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;

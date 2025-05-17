import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    if (!hasBeenOpened) {
      setHasBeenOpened(true);
    }
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setQuery("");
      onSearch("");
    }
  };

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isSearchOpen]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
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
        className={`flex items-center rounded-full overflow-hidden transition-all duration-300 ease-in-out
          ${isSearchOpen 
            ? 'bg-black/80 border border-white/30 backdrop-blur-md shadow-lg' 
            : 'bg-transparent hover:bg-black/30'}`}
        style={{ 
          width: isSearchOpen ? "300px" : "48px",
          minWidth: isSearchOpen ? "300px" : "48px"
        }}
      >
        {isSearchOpen && hasBeenOpened && (
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="search"
              placeholder="Títulos, pessoas, gêneros..."
              value={query}
              onChange={handleSearchInputChange}
              className="w-full bg-transparent border-none pl-4 pr-8 h-12
                placeholder:text-gray-400 text-white text-base
                focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0
                transition-all duration-200"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 
                  text-gray-400 hover:text-white transition-colors
                  p-1 rounded-full hover:bg-white/10"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}
        <Button
          type={isSearchOpen ? "submit" : "button"}
          onClick={!isSearchOpen ? toggleSearch : undefined}
          tabIndex={0}
          role="button"
          aria-label="Buscar conteúdo"
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap 
            rounded-full text-sm font-medium ring-offset-background 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 
            disabled:pointer-events-none disabled:opacity-50 
            [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 
            h-12 w-12 text-white border-2 border-transparent
            focus:border-white transition-all duration-200
            ${isSearchOpen 
              ? 'hover:bg-white/20 hover:text-white' 
              : 'hover:bg-white/10 hover:text-netflix-red'}
            ${isSearchOpen ? 'ml-auto' : ''}`}
        >
          <Search className="lucide lucide-search" aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;

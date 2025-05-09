
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
        className="flex items-center bg-black/60 rounded-full overflow-hidden transition-all duration-300"
        style={{ width: isSearchOpen ? "auto" : "40px" }}
      >
        {isSearchOpen && (
          <div className="relative">
            <Input
              type="search"
              placeholder="Títulos, pessoas, gêneros..."
              value={query}
              onChange={handleSearchInputChange}
              className="w-[200px] md:w-[300px] bg-transparent border-none pl-4 pr-8 placeholder:text-gray-400 text-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
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
          className="text-white hover:text-netflix-red"
        >
          <Search size={20} />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;

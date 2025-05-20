
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  defaultValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Pesquisar...",
  onSearch,
  className = "",
  defaultValue = ""
}) => {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex w-full ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 w-full"
      />
      <Button 
        type="submit" 
        variant="ghost" 
        className="absolute right-0 h-full px-3 text-gray-400 hover:text-white"
      >
        <Search className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default SearchBar;

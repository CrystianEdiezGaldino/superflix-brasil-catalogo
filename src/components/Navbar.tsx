
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const [query, setQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 66) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setQuery("");
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? "bg-black" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="container max-w-full px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="mr-10">
            <h1 className="text-netflix-red text-3xl font-bold">SuperFlix</h1>
          </Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="text-white hover:text-gray-300 transition">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/filmes" className="text-white hover:text-gray-300 transition">
                  Filmes
                </Link>
              </li>
              <li>
                <Link to="/series" className="text-white hover:text-gray-300 transition">
                  Séries
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center">
              {isSearchOpen && (
                <Input
                  type="search"
                  placeholder="Títulos, pessoas, gêneros..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="mr-2 w-[200px] md:w-[300px] bg-black/80 border-gray-700 placeholder:text-gray-400 text-white"
                />
              )}
              <Button
                type={isSearchOpen ? "submit" : "button"}
                onClick={!isSearchOpen ? toggleSearch : undefined}
                variant="ghost"
                size="icon"
                className="text-white"
              >
                <Search size={20} />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

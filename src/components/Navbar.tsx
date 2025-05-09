
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Film, Heart, Search, User, X, Tv, Baby } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar = ({
  onSearch
}: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
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
    onSearch(query); // Always trigger search even with empty query
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

  const isRouteActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? "bg-black shadow-lg" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="container max-w-full px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="mr-10">
            <h1 className="text-netflix-red text-3xl font-bold">NaFlixTV</h1>
          </Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <Link to="/" 
                  className={`flex items-center transition duration-300 ${
                    isRouteActive('/') && !isRouteActive('/filmes') && !isRouteActive('/series') && !isRouteActive('/animes') && !isRouteActive('/doramas') && !isRouteActive('/kids') && !isRouteActive('/favoritos') 
                    ? "text-netflix-red font-medium" 
                    : "text-white hover:text-netflix-red"
                  }`}
                >
                  <Film className="mr-1 h-4 w-4" />
                  Início
                </Link>
              </li>
              <li>
                <Link to="/filmes" 
                  className={`flex items-center transition duration-300 ${
                    isRouteActive('/filmes') 
                    ? "text-netflix-red font-medium" 
                    : "text-white hover:text-netflix-red"
                  }`}
                >
                  <Film className="mr-1 h-4 w-4" />
                  Filmes
                </Link>
              </li>
              <li>
                <Link to="/series" 
                  className={`flex items-center transition duration-300 ${
                    isRouteActive('/series') 
                    ? "text-netflix-red font-medium" 
                    : "text-white hover:text-netflix-red"
                  }`}
                >
                  <Tv className="mr-1 h-4 w-4" />
                  Séries
                </Link>
              </li>
              <li>
                <Link to="/animes" 
                  className={`flex items-center transition duration-300 ${
                    isRouteActive('/animes') 
                    ? "text-netflix-red font-medium" 
                    : "text-white hover:text-netflix-red"
                  }`}
                >
                  <Film className="mr-1 h-4 w-4" />
                  Animes
                </Link>
              </li>
              <li>
                <Link to="/doramas" 
                  className={`flex items-center transition duration-300 ${
                    isRouteActive('/doramas') 
                    ? "text-netflix-red font-medium" 
                    : "text-white hover:text-netflix-red"
                  }`}
                >
                  <Tv className="mr-1 h-4 w-4" />
                  Doramas
                </Link>
              </li>
              <li>
                <Link to="/kids" 
                  className={`flex items-center transition duration-300 ${
                    isRouteActive('/kids') 
                    ? "text-netflix-red font-medium" 
                    : "text-white hover:text-netflix-red"
                  }`}
                >
                  <Baby className="mr-1 h-4 w-4" />
                  Kids
                </Link>
              </li>
              {user && (
                <li>
                  <Link to="/favoritos" 
                    className={`flex items-center transition duration-300 ${
                      isRouteActive('/favoritos') 
                      ? "text-netflix-red font-medium" 
                      : "text-white hover:text-netflix-red"
                    }`}
                  >
                    <Heart className="mr-1 h-4 w-4" />
                    Meus Favoritos
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className="flex items-center">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center bg-black/60 rounded-full overflow-hidden transition-all duration-300" 
                style={{ width: isSearchOpen ? 'auto' : '40px' }}>
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
          
          {user ? (
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="ml-2 hover:bg-netflix-red/20">
                <User size={20} className="text-white" />
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="ml-2 border-netflix-red text-white hover:bg-netflix-red hover:text-white">
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

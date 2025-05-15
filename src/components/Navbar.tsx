import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { 
  Film, 
  Tv, 
  Monitor, 
  Baby, 
  FileText, 
  Search, 
  User, 
  LogOut 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useSubscription();
  const navigate = useNavigate();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/90 backdrop-blur-sm shadow-lg' 
            : 'bg-gradient-to-b from-black/80 via-black/50 to-transparent'
        }`}
      >
        <div className="container max-w-full px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="mr-10">
              <img 
                src="/lovable-uploads/efa84daa-353c-4a55-836f-0baef660aba2.png" 
                alt="NaflixTV Logo" 
                className="h-10 md:h-12 transition-transform duration-300 hover:scale-105"
              />
            </Link>

            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li>
                  <Link 
                    to="/" 
                    className={`flex items-center transition duration-300 border-b-2 py-1 ${
                      isActive('/') 
                        ? 'text-white border-white' 
                        : 'text-white/80 hover:text-white border-transparent hover:border-white/30'
                    }`}
                  >
                    <Film className={`mr-1.5 h-4 w-4 transition-transform duration-300 ${
                      isActive('/') ? 'text-netflix-red' : ''
                    }`} />
                    Início
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/filmes" 
                    className={`flex items-center transition duration-300 border-b-2 py-1 ${
                      isActive('/filmes') 
                        ? 'text-white border-white' 
                        : 'text-white/80 hover:text-white border-transparent hover:border-white/30'
                    }`}
                  >
                    <Film className={`mr-1.5 h-4 w-4 transition-transform duration-300 ${
                      isActive('/filmes') ? 'text-netflix-red' : ''
                    }`} />
                    Filmes
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/series" 
                    className={`flex items-center transition duration-300 border-b-2 py-1 ${
                      isActive('/series') 
                        ? 'text-white border-white' 
                        : 'text-white/80 hover:text-white border-transparent hover:border-white/30'
                    }`}
                  >
                    <Tv className={`mr-1.5 h-4 w-4 transition-transform duration-300 ${
                      isActive('/series') ? 'text-netflix-red' : ''
                    }`} />
                    Séries
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/animes" 
                    className={`flex items-center transition duration-300 border-b-2 py-1 ${
                      isActive('/animes') 
                        ? 'text-white border-white' 
                        : 'text-white/80 hover:text-white border-transparent hover:border-white/30'
                    }`}
                  >
                    <Film className={`mr-1.5 h-4 w-4 transition-transform duration-300 ${
                      isActive('/animes') ? 'text-netflix-red' : ''
                    }`} />
                    Animes
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/doramas" 
                    className={`flex items-center transition duration-300 border-b-2 py-1 ${
                      isActive('/doramas') 
                        ? 'text-white border-white' 
                        : 'text-white/80 hover:text-white border-transparent hover:border-white/30'
                    }`}
                  >
                    <Tv className={`mr-1.5 h-4 w-4 transition-transform duration-300 ${
                      isActive('/doramas') ? 'text-netflix-red' : ''
                    }`} />
                    Doramas
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/tv-channels" 
                    className={`flex items-center transition duration-300 border-b-2 py-1 ${
                      isActive('/tv-channels') 
                        ? 'text-white border-white' 
                        : 'text-white/80 hover:text-white border-transparent hover:border-white/30'
                    }`}
                  >
                    <Monitor className={`mr-1.5 h-4 w-4 transition-transform duration-300 ${
                      isActive('/tv-channels') ? 'text-netflix-red' : ''
                    }`} />
                    Canais de TV
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/kids" 
                    className={`flex items-center transition duration-300 border-b-2 py-1 ${
                      isActive('/kids') 
                        ? 'text-white border-white' 
                        : 'text-white/80 hover:text-white border-transparent hover:border-white/30'
                    }`}
                  >
                    <Baby className={`mr-1.5 h-4 w-4 transition-transform duration-300 ${
                      isActive('/kids') ? 'text-netflix-red' : ''
                    }`} />
                    Kids
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/termos-de-servico" 
                    className={`flex items-center transition duration-300 border-b-2 py-1 ${
                      isActive('/termos-de-servico') 
                        ? 'text-white border-white' 
                        : 'text-white/80 hover:text-white border-transparent hover:border-white/30'
                    }`}
                  >
                    <FileText className={`mr-1.5 h-4 w-4 transition-transform duration-300 ${
                      isActive('/termos-de-servico') ? 'text-netflix-red' : ''
                    }`} />
                    Termos
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex items-center space-x-5">
            <form onSubmit={handleSearch} className="relative">
              <div 
                className={`flex items-center rounded-full overflow-hidden transition-all duration-300 bg-transparent ${
                  isSearchExpanded ? 'w-64' : 'w-10'
                }`}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-netflix-red transition-colors duration-300"
                  onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                >
                  <Search className="h-4 w-4" />
                </Button>
                {isSearchExpanded && (
                  <Input
                    type="text"
                    placeholder="Buscar..."
                    className="bg-transparent border-none text-white placeholder:text-white/50 focus-visible:ring-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                )}
              </div>
            </form>

            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link to="/admin">
                    <Button 
                      variant="outline" 
                      className={`border-netflix-red text-white hover:bg-netflix-red hover:text-white transition-all duration-300 ${
                        isActive('/admin') ? 'bg-netflix-red' : ''
                      }`}
                    >
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  className="border-netflix-red text-white hover:bg-netflix-red hover:text-white transition-all duration-300"
                  onClick={async () => {
                    try {
                      // Primeiro, fazer logout no Supabase
                      await supabase.auth.signOut();
                      
                      // Limpar qualquer estado local
                      localStorage.removeItem('userSubscription');
                      
                      // Forçar um refresh da página para garantir que todos os estados sejam resetados
                      window.location.href = '/auth';
                    } catch (error) {
                      console.error('Error signing out:', error);
                    }
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="border-netflix-red text-white hover:bg-netflix-red hover:text-white transition-all duration-300">
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      {/* Spacer para compensar a navbar fixa */}
      <div className="h-[72px] md:h-[80px]" />
    </>
  );
};

export default Navbar;

import { useState } from "react";
<<<<<<< HEAD
import { Film, Tv, Baby, Heart, FileText, Monitor, X } from "lucide-react";
=======
import { Film, Tv, Baby, Heart, FileText, Monitor, Search } from "lucide-react";
>>>>>>> d49e97c11088c627460ed8d7be45f118db33758a
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
<<<<<<< HEAD
import SearchBar from "./SearchBar";
=======
import { Input } from "@/components/ui/input";
>>>>>>> d49e97c11088c627460ed8d7be45f118db33758a
import { pauseDoramasProcessing } from "@/services/doramas";

interface NavLinkItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface MobileMenuProps {
  isAuthenticated?: boolean;
  isAdmin?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (query: string) => void;
}

const MobileMenu = ({ 
  isAuthenticated = false, 
  isAdmin = false, 
  isOpen, 
  onClose,
  onSearch 
}: MobileMenuProps) => {
  const location = useLocation();
<<<<<<< HEAD
=======
  const [searchQuery, setSearchQuery] = useState("");
>>>>>>> d49e97c11088c627460ed8d7be45f118db33758a

  const isRouteActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

<<<<<<< HEAD
=======
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    onClose();
  };

>>>>>>> d49e97c11088c627460ed8d7be45f118db33758a
  const handleLinkClick = () => {
    if (window.location.pathname === '/doramas') {
      pauseDoramasProcessing();
    }
    onClose();
  };

  // Define navigation links
  const navigationLinks: NavLinkItem[] = [
<<<<<<< HEAD
    { path: "/", label: "Início", icon: <Film className="h-5 w-5" /> },
    { path: "/filmes", label: "Filmes", icon: <Film className="h-5 w-5" /> },
    { path: "/series", label: "Séries", icon: <Tv className="h-5 w-5" /> },
    { path: "/animes", label: "Animes", icon: <Film className="h-5 w-5" /> },
    { path: "/doramas", label: "Doramas", icon: <Tv className="h-5 w-5" /> },
    { path: "/kids", label: "Kids", icon: <Baby className="h-5 w-5" /> },
    { path: "/tv-channels", label: "TV", icon: <Monitor className="h-5 w-5" /> },
=======
    { path: "/", label: "Início", icon: <Film className="h-4 w-4" /> },
    { path: "/filmes", label: "Filmes", icon: <Film className="h-4 w-4" /> },
    { path: "/series", label: "Séries", icon: <Tv className="h-4 w-4" /> },
    { path: "/animes", label: "Animes", icon: <Film className="h-4 w-4" /> },
    { path: "/doramas", label: "Doramas", icon: <Tv className="h-4 w-4" /> },
    { path: "/kids", label: "Kids", icon: <Baby className="h-4 w-4" /> },
    { path: "/tv-channels", label: "Canais de TV", icon: <Monitor className="h-4 w-4" /> },
>>>>>>> d49e97c11088c627460ed8d7be45f118db33758a
  ];

  // Add Favorites if authenticated
  const allLinks = [...navigationLinks];
  
  if (isAuthenticated) {
<<<<<<< HEAD
    allLinks.push({ path: "/favoritos", label: "Favoritos", icon: <Heart className="h-5 w-5" /> });
  }
  
  // Add Terms of Service
  allLinks.push({ path: "/termos-de-servico", label: "Termos", icon: <FileText className="h-5 w-5" /> });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="bg-black/95 border-netflix-gray/30 w-[85%] p-0 backdrop-blur-md"
        tabIndex={0}
      >
        <SheetHeader className="p-4 border-b border-netflix-gray/20 flex flex-row items-center justify-between">
          <SheetTitle className="text-white text-xl font-bold" tabIndex={0}>Menu</SheetTitle>
          <button
            onClick={onClose}
            tabIndex={0}
            role="button"
            aria-label="Fechar menu"
            className="text-white hover:text-netflix-red transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-md p-1"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </SheetHeader>
        
        {/* Mobile Search */}
        <div className="p-4 border-b border-netflix-gray/20 bg-black/50">
          <SearchBar onSearch={onSearch || (() => {})} />
        </div>
        
        <nav aria-label="Menu de navegação mobile" className="overflow-y-auto h-[calc(100vh-180px)]">
          <ul className="py-4 space-y-2 px-4">
            {allLinks.map((link, index) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  tabIndex={0}
                  role="menuitem"
                  className={`flex items-center py-3 px-4 rounded-[45px] transition-all duration-200 
                    focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black
                    border-2 ${
                      isRouteActive(link.path)
                        ? "bg-netflix-red/20 text-netflix-red border-netflix-red/50"
                        : "text-white border-white/30 hover:border-white hover:bg-white/5"
                    }`}
                  onClick={handleLinkClick}
                  aria-current={isRouteActive(link.path) ? "page" : undefined}
                  aria-label={link.label}
                >
                  <span className="mr-3" aria-hidden="true">{link.icon}</span>
                  <span className="text-base font-medium">{link.label}</span>
=======
    allLinks.push({ path: "/favoritos", label: "Favoritos", icon: <Heart className="h-4 w-4" /> });
  }
  
  // Add Terms of Service
  allLinks.push({ path: "/termos-de-servico", label: "Termos de Serviço", icon: <FileText className="h-4 w-4" /> });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="bg-black/95 border-netflix-gray/30 w-[80%] p-0">
        <SheetHeader className="p-4 border-b border-netflix-gray/20">
          <SheetTitle className="text-white">Menu</SheetTitle>
        </SheetHeader>
        
        {/* Mobile Search */}
        <div className="p-4 border-b border-netflix-gray/20">
          <form onSubmit={handleSearch} className="flex">
            <Input
              type="search"
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-900/80 border border-gray-700/50 text-white placeholder:text-gray-400"
            />
            <button
              type="submit" 
              className="ml-2 bg-netflix-red/90 hover:bg-netflix-red text-white p-2 rounded"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>
        
        <div className="py-4">
          <ul className="space-y-1 px-2">
            {allLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center py-2.5 px-3 rounded-md transition duration-200 ${
                    isRouteActive(link.path)
                      ? "bg-netflix-red/20 text-netflix-red font-medium"
                      : "text-white hover:bg-gray-800/50"
                  }`}
                  onClick={handleLinkClick}
                >
                  <span className="mr-3">{link.icon}</span>
                  <span>{link.label}</span>
>>>>>>> d49e97c11088c627460ed8d7be45f118db33758a
                </Link>
              </li>
            ))}
          </ul>
<<<<<<< HEAD
        </nav>
=======
        </div>
>>>>>>> d49e97c11088c627460ed8d7be45f118db33758a
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;

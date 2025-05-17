import { useState } from "react";
import { Film, Tv, Baby, Heart, FileText, Monitor, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import SearchBar from "./SearchBar";
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

  const isRouteActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLinkClick = () => {
    if (window.location.pathname === '/doramas') {
      pauseDoramasProcessing();
    }
    onClose();
  };

  // Define navigation links
  const navigationLinks: NavLinkItem[] = [
    { path: "/", label: "Início", icon: <Film className="h-5 w-5" /> },
    { path: "/filmes", label: "Filmes", icon: <Film className="h-5 w-5" /> },
    { path: "/series", label: "Séries", icon: <Tv className="h-5 w-5" /> },
    { path: "/animes", label: "Animes", icon: <Film className="h-5 w-5" /> },
    { path: "/doramas", label: "Doramas", icon: <Tv className="h-5 w-5" /> },
    { path: "/kids", label: "Kids", icon: <Baby className="h-5 w-5" /> },
    { path: "/tv-channels", label: "TV", icon: <Monitor className="h-5 w-5" /> },
  ];

  // Add Favorites if authenticated
  const allLinks = [...navigationLinks];
  
  if (isAuthenticated) {
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
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;

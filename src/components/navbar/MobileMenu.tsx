import { useState } from "react";
import { Film, Tv, Baby, Heart, FileText, Monitor, X, LogOut, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import SearchBar from "./SearchBar";
import { pauseDoramasProcessing } from "@/services/doramas";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
  const { signOut } = useAuth();

  const isRouteActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLinkClick = () => {
    if (window.location.pathname === '/doramas') {
      pauseDoramasProcessing();
    }
    onClose();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Clear any session-related data
      localStorage.removeItem('supabase.auth.token');
      // Use window.location.href instead of reload to ensure a fresh state
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    }
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="bg-black/95 border-netflix-gray/30 w-[85%] p-0 backdrop-blur-md"
        tabIndex={0}
      >
        <SheetHeader className="p-4 border-b border-netflix-gray/20 flex flex-row items-center justify-between">
          <SheetTitle className="text-white text-xl font-bold" tabIndex={0}>Menu</SheetTitle>
        </SheetHeader>
        
        {/* Mobile Search */}
        <div className="p-4 border-b border-netflix-gray/20 bg-black/50">
          <SearchBar onSearch={onSearch || (() => {})} />
        </div>
        
        <nav className="flex flex-col h-full">
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

            {isAuthenticated && (
              <>
                <li>
                  <Link
                    to="/profile"
                    tabIndex={0}
                    role="menuitem"
                    className="flex items-center py-3 px-4 rounded-[45px] transition-all duration-200 
                      focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black
                      border-2 text-white border-white/30 hover:border-white hover:bg-white/5"
                    onClick={handleLinkClick}
                    aria-label="Meu Perfil"
                  >
                    <span className="mr-3" aria-hidden="true">
                      <User className="h-5 w-5" />
                    </span>
                    <span className="text-base font-medium">Meu Perfil</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    tabIndex={0}
                    role="menuitem"
                    className="flex items-center w-full py-3 px-4 rounded-[45px] transition-all duration-200 
                      focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black
                      border-2 text-white border-white/30 hover:border-white hover:bg-white/5"
                    aria-label="Sair"
                  >
                    <span className="mr-3" aria-hidden="true">
                      <LogOut className="h-5 w-5" />
                    </span>
                    <span className="text-base font-medium">Sair</span>
                  </button>
                </li>
              </>
            )}

            <li>
              <Link
                to="/termos-de-servico"
                tabIndex={0}
                role="menuitem"
                className="flex items-center py-3 px-4 rounded-[45px] transition-all duration-200 
                  focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black
                  border-2 text-white border-white/30 hover:border-white hover:bg-white/5"
                onClick={handleLinkClick}
                aria-label="Termos"
              >
                <span className="mr-3" aria-hidden="true">
                  <FileText className="h-5 w-5" />
                </span>
                <span className="text-base font-medium">Termos</span>
              </Link>
            </li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;

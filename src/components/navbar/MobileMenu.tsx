
import { useState } from "react";
import { Film, Tv, Baby, Heart, FileText, Monitor, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

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
  const [searchQuery, setSearchQuery] = useState("");

  const isRouteActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    onClose();
  };

  // Define navigation links
  const navigationLinks: NavLinkItem[] = [
    { path: "/", label: "Início", icon: <Film className="h-4 w-4" /> },
    { path: "/filmes", label: "Filmes", icon: <Film className="h-4 w-4" /> },
    { path: "/series", label: "Séries", icon: <Tv className="h-4 w-4" /> },
    { path: "/animes", label: "Animes", icon: <Film className="h-4 w-4" /> },
    { path: "/doramas", label: "Doramas", icon: <Tv className="h-4 w-4" /> },
    { path: "/kids", label: "Kids", icon: <Baby className="h-4 w-4" /> },
    { path: "/tv-channels", label: "Canais de TV", icon: <Monitor className="h-4 w-4" /> },
  ];

  // Add Favorites if authenticated
  const allLinks = [...navigationLinks];
  
  if (isAuthenticated) {
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
                  onClick={onClose}
                >
                  <span className="mr-3">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;


import { useState } from "react";
import { Film, Tv, Baby, Heart, FileText, Monitor } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
}

const MobileMenu = ({ isAuthenticated = false, isAdmin = false, isOpen, onClose }: MobileMenuProps) => {
  const location = useLocation();

  const isRouteActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Define navigation links directly in the component
  const navigationLinks: NavLinkItem[] = [
    { path: "/", label: "Início", icon: <Film className="mr-1 h-4 w-4" /> },
    { path: "/filmes", label: "Filmes", icon: <Film className="mr-1 h-4 w-4" /> },
    { path: "/series", label: "Séries", icon: <Tv className="mr-1 h-4 w-4" /> },
    { path: "/animes", label: "Animes", icon: <Film className="mr-1 h-4 w-4" /> },
    { path: "/doramas", label: "Doramas", icon: <Tv className="mr-1 h-4 w-4" /> },
    { path: "/kids", label: "Kids", icon: <Baby className="mr-1 h-4 w-4" /> }
  ];

  // Add admin links if user is admin
  const enhancedLinks = [
    ...navigationLinks,
    { path: "/tv-channels", label: "Canais de TV", icon: <Monitor className="mr-1 h-4 w-4" /> }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="bg-netflix-background border-netflix-gray w-[80%] p-0">
        <SheetHeader className="p-4 border-b border-netflix-gray/20">
          <SheetTitle className="text-white">Menu</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <ul className="flex flex-col space-y-4 px-4">
            {enhancedLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center py-2 transition duration-300 ${
                    isRouteActive(link.path)
                      ? "text-netflix-red font-medium"
                      : "text-white hover:text-netflix-red"
                  }`}
                  onClick={onClose}
                >
                  {link.icon}
                  <span className="ml-2">{link.label}</span>
                </Link>
              </li>
            ))}
            
            {isAuthenticated && (
              <li>
                <Link
                  to="/favoritos"
                  className={`flex items-center py-2 transition duration-300 ${
                    isRouteActive('/favoritos')
                      ? "text-netflix-red font-medium"
                      : "text-white hover:text-netflix-red"
                  }`}
                  onClick={onClose}
                >
                  <Heart className="mr-1 h-4 w-4" />
                  <span className="ml-2">Meus Favoritos</span>
                </Link>
              </li>
            )}
            
            <li>
              <Link
                to="/termos-de-servico"
                className={`flex items-center py-2 transition duration-300 ${
                  isRouteActive('/termos-de-servico')
                    ? "text-netflix-red font-medium"
                    : "text-white hover:text-netflix-red"
                }`}
                onClick={onClose}
              >
                <FileText className="mr-1 h-4 w-4" />
                <span className="ml-2">Termos de Serviço</span>
              </Link>
            </li>
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;

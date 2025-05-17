import { Film, Tv, Baby, Heart, FileText, Monitor } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { pauseDoramasProcessing } from "@/services/doramas";

interface NavLinksProps {
  isAuthenticated?: boolean;
  isAdmin?: boolean;
}

const NavLinks = ({ isAuthenticated = false, isAdmin = false }: NavLinksProps) => {
  const location = useLocation();

  const isRouteActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLinkClick = () => {
    if (window.location.pathname === '/doramas') {
      pauseDoramasProcessing();
    }
  };

  // Define navigation links
  const navigationLinks = [
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
    <nav aria-label="Navegação principal" className="flex justify-center w-full">
      <ul className="flex items-center space-x-2" role="menubar">
        {allLinks.map((link, index) => (
          <li key={link.path} role="none">
            <Link
              to={link.path}
              tabIndex={0}
              role="menuitem"
              className={`flex items-center px-4 py-2.5 text-base font-medium rounded-[45px] transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-netflix-red focus:ring-offset-2 focus:ring-offset-black
                border-2 whitespace-nowrap ${
                  isRouteActive(link.path)
                    ? "bg-netflix-red/20 text-netflix-red border-netflix-red/50"
                    : "text-white border-white/30 hover:border-white hover:bg-white/5"
                }`}
              onClick={handleLinkClick}
              aria-current={isRouteActive(link.path) ? "page" : undefined}
              aria-label={link.label}
            >
              <span className="mr-2" aria-hidden="true">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavLinks;

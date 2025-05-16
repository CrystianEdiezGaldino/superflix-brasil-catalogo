
import { Film, Tv, Baby, Heart, FileText, Monitor } from "lucide-react";
import { useLocation } from "react-router-dom";
import NavLink from "./NavLink";

interface NavLinksProps {
  isAuthenticated?: boolean;
  isAdmin?: boolean;
}

const NavLinks = ({ isAuthenticated = false, isAdmin = false }: NavLinksProps) => {
  const location = useLocation();
  
  const isHomeActive = () => {
    return location.pathname === '/' && 
      !location.pathname.startsWith('/filmes') && 
      !location.pathname.startsWith('/series') && 
      !location.pathname.startsWith('/animes') && 
      !location.pathname.startsWith('/doramas') && 
      !location.pathname.startsWith('/kids') && 
      !location.pathname.startsWith('/favoritos');
  };

  return (
    <nav className="hidden md:block">
      <ul className="flex items-center space-x-4 lg:space-x-6">
        <NavLink to="/" checkActive={() => isHomeActive()}>
          <Film className="mr-1 h-3.5 w-3.5" />
          <span>Início</span>
        </NavLink>
        
        <NavLink to="/filmes">
          <Film className="mr-1 h-3.5 w-3.5" />
          <span>Filmes</span>
        </NavLink>
        
        <NavLink to="/series">
          <Tv className="mr-1 h-3.5 w-3.5" />
          <span>Séries</span>
        </NavLink>
        
        <NavLink to="/animes">
          <Film className="mr-1 h-3.5 w-3.5" />
          <span>Animes</span>
        </NavLink>
        
        <NavLink to="/doramas">
          <Tv className="mr-1 h-3.5 w-3.5" />
          <span>Doramas</span>
        </NavLink>

        <NavLink to="/tv-channels">
          <Monitor className="mr-1 h-3.5 w-3.5" />
          <span>Canais de TV</span>
        </NavLink>
        
        <NavLink to="/kids">
          <Baby className="mr-1 h-3.5 w-3.5" />
          <span>Kids</span>
        </NavLink>
        
        {isAuthenticated && (
          <NavLink to="/favoritos">
            <Heart className="mr-1 h-3.5 w-3.5" />
            <span>Favoritos</span>
          </NavLink>
        )}
        
        <NavLink to="/termos-de-servico">
          <FileText className="mr-1 h-3.5 w-3.5" />
          <span>Termos</span>
        </NavLink>
      </ul>
    </nav>
  );
};

export default NavLinks;

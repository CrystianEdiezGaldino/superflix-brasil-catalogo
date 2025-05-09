
import { Film, Tv, Baby, Heart } from "lucide-react";
import { useLocation } from "react-router-dom";
import NavLink from "./NavLink";

interface NavLinksProps {
  isAuthenticated: boolean;
}

const NavLinks = ({ isAuthenticated }: NavLinksProps) => {
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
      <ul className="flex space-x-6">
        <NavLink to="/" checkActive={() => isHomeActive()}>
          <Film className="mr-1 h-4 w-4" />
          Início
        </NavLink>
        
        <NavLink to="/filmes">
          <Film className="mr-1 h-4 w-4" />
          Filmes
        </NavLink>
        
        <NavLink to="/series">
          <Tv className="mr-1 h-4 w-4" />
          Séries
        </NavLink>
        
        <NavLink to="/animes">
          <Film className="mr-1 h-4 w-4" />
          Animes
        </NavLink>
        
        <NavLink to="/doramas">
          <Tv className="mr-1 h-4 w-4" />
          Doramas
        </NavLink>
        
        <NavLink to="/kids">
          <Baby className="mr-1 h-4 w-4" />
          Kids
        </NavLink>
        
        {isAuthenticated && (
          <NavLink to="/favoritos">
            <Heart className="mr-1 h-4 w-4" />
            Meus Favoritos
          </NavLink>
        )}
      </ul>
    </nav>
  );
};

export default NavLinks;

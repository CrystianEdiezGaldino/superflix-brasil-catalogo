
import { Link } from "react-router-dom";

const NavLogo = () => {
  return (
    <Link to="/" className="relative group flex items-center">
      <img 
        src="/lovable-uploads/efa84daa-353c-4a55-836f-0baef660aba2.png" 
        alt="NaflixTV Logo" 
        className="h-8 md:h-10 transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-netflix-red group-hover:w-full transition-all duration-300"></div>
    </Link>
  );
};

export default NavLogo;

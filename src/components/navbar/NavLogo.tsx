
import { Link } from "react-router-dom";

const NavLogo = () => {
  return (
    <Link to="/" className="mr-10">
      <img 
        src="/lovable-uploads/efa84daa-353c-4a55-836f-0baef660aba2.png" 
        alt="NaflixTV Logo" 
        className="h-10 md:h-12"
      />
    </Link>
  );
};

export default NavLogo;

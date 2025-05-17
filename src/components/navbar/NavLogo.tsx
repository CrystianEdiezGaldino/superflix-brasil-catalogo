import { Link } from "react-router-dom";

const NavLogo = () => {
  return (
    <Link 
      to="/" 
      className="relative group flex items-center focus:outline-none focus:ring-2 focus:ring-netflix-red focus:ring-offset-2 focus:ring-offset-black rounded-md"
      tabIndex={0}
      aria-label="Ir para a página inicial"
    >
      <img 
        src="/lovable-uploads/efa84daa-353c-4a55-836f-0baef660aba2.png" 
        alt="NaflixTV Logo" 
        className="h-16 md:h-10 lg:h-20 transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-netflix-red group-hover:w-full transition-all duration-300"></div>
    </Link>
  );
};

export default NavLogo;

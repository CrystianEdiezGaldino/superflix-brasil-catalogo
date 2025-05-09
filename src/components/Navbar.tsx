
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import NavLogo from "./navbar/NavLogo";
import NavLinks from "./navbar/NavLinks";
import SearchBar from "./navbar/SearchBar";
import UserAction from "./navbar/UserAction";
import MobileMenu from "./navbar/MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Film, Heart, Tv, Baby } from "lucide-react";

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();

  // Navigation links for mobile menu
  const navigationLinks = [
    { path: "/", label: "Início", icon: <Film className="mr-1 h-4 w-4" /> },
    { path: "/filmes", label: "Filmes", icon: <Film className="mr-1 h-4 w-4" /> },
    { path: "/series", label: "Séries", icon: <Tv className="mr-1 h-4 w-4" /> },
    { path: "/animes", label: "Animes", icon: <Film className="mr-1 h-4 w-4" /> },
    { path: "/doramas", label: "Doramas", icon: <Tv className="mr-1 h-4 w-4" /> },
    { path: "/kids", label: "Kids", icon: <Baby className="mr-1 h-4 w-4" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 66) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? "bg-black shadow-lg" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="container max-w-full px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <NavLogo />
          {!isMobile && <NavLinks isAuthenticated={!!user} />}
        </div>

        <div className="flex items-center">
          <SearchBar onSearch={onSearch} />
          {isMobile && (
            <MobileMenu isAuthenticated={!!user} navigationLinks={navigationLinks} />
          )}
          <UserAction isAuthenticated={!!user} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;

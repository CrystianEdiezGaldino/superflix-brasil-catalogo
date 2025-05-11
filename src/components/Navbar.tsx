
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import NavLogo from "./navbar/NavLogo";
import NavLinks from "./navbar/NavLinks";
import SearchBar from "./navbar/SearchBar";
import UserAction from "./navbar/UserAction";
import MobileMenu from "./navbar/MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Film, Heart, Tv, Baby, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin } = useSubscription();
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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-black/95 backdrop-blur-sm shadow-lg" 
          : "bg-gradient-to-b from-black/80 via-black/50 to-transparent"
      }`}
    >
      <div className="container max-w-full px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <NavLogo />
          {!isMobile && <NavLinks isAuthenticated={!!user} />}
        </div>

        <div className="flex items-center space-x-5">
          <SearchBar onSearch={onSearch} />
          
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-netflix-red transition-colors"
              onClick={() => window.location.href = "/admin"}
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin
            </Button>
          )}
          
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

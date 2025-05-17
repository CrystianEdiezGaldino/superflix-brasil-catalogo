import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import NavLinks from "./navbar/NavLinks";
import NavLogo from "./navbar/NavLogo";
import SearchBar from "./navbar/SearchBar";
import UserAction from "./navbar/UserAction";
import MobileMenu from "./navbar/MobileMenu";
import { HelpButton } from "./help/HelpButton";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onSearch?: (query: string) => Promise<void> | void;
}

const Navbar = ({ onSearch = () => {} }: NavbarProps) => {
  const { user } = useAuth();
  const { isAdmin } = useSubscription();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    console.log("Navbar - User state:", { user });
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 20;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 h-20 pt-2.5",
        isScrolled 
          ? "bg-black/85 backdrop-blur-md shadow-md" 
          : "bg-gradient-to-b from-black/90 to-transparent"
      )}
      role="banner"
      aria-label="Barra de navegação principal"
    >
      <div className="container max-w-screen-xl mx-auto px-4 md:px-6 h-full flex items-center">
        {/* Logo - Fixed Position */}
        <div className="absolute left-4 top-1 z-50">
          <NavLogo />
        </div>

        {/* Navigation Links - Centered */}
        <div className="hidden md:flex w-full justify-center items-center h-full">
          <NavLinks isAuthenticated={!!user} isAdmin={isAdmin} />
        </div>

        {/* Search Bar and User Actions */}
        <div className="flex items-center space-x-4 h-full ml-auto">
          <div className="hidden sm:block w-auto">
            <SearchBar onSearch={onSearch} />
          </div>

          {user && (
            <button
              tabIndex={0}
              role="button"
              aria-label="Ajuda"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 
                disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 
                hover:bg-accent h-12 w-12 text-white border-2 border-transparent
                focus:border-white hover:text-netflix-red transition-colors"
            >
              <HelpButton />
            </button>
          )}

          {user ? (
            <UserAction isAuthenticated={!!user} />
          ) : (
            <Link 
              to="/auth" 
              tabIndex={0}
              role="button"
              aria-label="Entrar na sua conta"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 
                disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 
                hover:bg-accent h-12 w-12 text-white border-2 border-transparent
                focus:border-white hover:text-netflix-red transition-colors"
            >
              Entrar
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            tabIndex={0}
            role="button"
            aria-label="Abrir menu mobile"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            className="md:hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background 
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 
              disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 
              hover:bg-accent h-12 w-12 text-white border-2 border-transparent
              focus:border-white hover:text-netflix-red transition-colors"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={toggleMobileMenu} 
        isAuthenticated={!!user}
        isAdmin={isAdmin}
        onSearch={onSearch}
      />
    </nav>
  );
};

export default Navbar;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import NavLinks from "./navbar/NavLinks";
import NavLogo from "./navbar/NavLogo";
import SearchBar from "./navbar/SearchBar";
import UserAction from "./navbar/UserAction";
import MobileMenu from "./navbar/MobileMenu";
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
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        isScrolled 
          ? "bg-black/85 backdrop-blur-md shadow-md py-2" 
          : "bg-gradient-to-b from-black/90 to-transparent py-3"
      )}
    >
      <div className="container max-w-screen-xl mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo and Navigation Links */}
        <div className="flex items-center">
          <NavLogo />
          <div className="hidden md:flex ml-8">
            <NavLinks isAuthenticated={!!user} isAdmin={isAdmin} />
          </div>
        </div>

        {/* Search Bar and User Actions */}
        <div className="flex items-center space-x-4">
          <div className="mr-2 w-auto hidden sm:block">
            <SearchBar onSearch={onSearch} />
          </div>

          {user ? (
            <UserAction isAuthenticated={!!user} />
          ) : (
            <Link 
              to="/auth" 
              className="text-white hover:text-gray-300 text-sm font-medium py-1.5 px-4 border border-transparent hover:border-white/30 rounded-md transition-colors"
            >
              Entrar
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white focus:outline-none hover:text-netflix-red transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={toggleMobileMenu} 
        isAuthenticated={!!user}
        isAdmin={isAdmin}
      />
    </nav>
  );
};

export default Navbar;

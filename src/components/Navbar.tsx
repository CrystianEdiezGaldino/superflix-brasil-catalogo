
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

const Navbar = ({ onSearch }: NavbarProps) => {
  const { user } = useAuth();
  const { isAdmin } = useSubscription();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 50;
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
        "fixed top-0 left-0 w-full z-50 transition-colors duration-300",
        isScrolled ? "bg-netflix-nav-scrolled" : "bg-netflix-nav-transparent"
      )}
    >
      <div className="container max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo and Navigation Links */}
        <div className="flex items-center">
          <NavLogo />
          <div className="hidden md:flex ml-8">
            <NavLinks isAuthenticated={!!user} isAdmin={isAdmin} />
          </div>
        </div>

        {/* Search Bar and User Actions */}
        <div className="flex items-center">
          <div className="mr-4 w-64 hidden lg:block">
            <SearchBar onSearch={onSearch} />
          </div>

          {user ? (
            <UserAction isAuthenticated={!!user} />
          ) : (
            <Link to="/auth" className="text-white hover:text-gray-300">
              Entrar
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white focus:outline-none ml-4"
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

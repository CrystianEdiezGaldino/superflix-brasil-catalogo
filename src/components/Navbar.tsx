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
          ? "bg-black/95 backdrop-blur-md shadow-lg" 
          : "bg-gradient-to-b from-black/90 to-transparent"
      )}
      role="banner"
      aria-label="Barra de navegação principal"
    >
      <div className="container max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Seção Esquerda - Logo */}
        <div className="flex items-center">
          <NavLogo />
        </div>

        {/* Seção Central - Links de Navegação */}
        <div className="hidden lg:flex items-center justify-center flex-1 px-8">
          <NavLinks isAuthenticated={!!user} isAdmin={isAdmin} />
        </div>

        {/* Seção Direita - Ações do Usuário */}
        <div className="flex items-center space-x-4">
          {/* Barra de Pesquisa */}
          <div className="hidden md:block">
            <SearchBar onSearch={onSearch} />
          </div>

          {/* Botão de Ajuda */}
          {user && (
            <button
              tabIndex={0}
              role="button"
              aria-label="Ajuda"
              className="inline-flex items-center justify-center rounded-full text-sm font-medium
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 
                disabled:pointer-events-none disabled:opacity-50
                hover:bg-accent h-10 w-10 text-white
                hover:text-netflix-red transition-colors"
            >
              <HelpButton />
            </button>
          )}

          {/* Ações do Usuário */}
          {user ? (
            <div className="flex items-center">
              <UserAction isAuthenticated={!!user} />
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium
                bg-netflix-red text-white hover:bg-red-700 transition-colors
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Entrar
            </Link>
          )}

          {/* Botão do Menu Mobile */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden inline-flex items-center justify-center rounded-full
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2
              h-10 w-10 text-white hover:text-netflix-red transition-colors"
            aria-label="Abrir menu mobile"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
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

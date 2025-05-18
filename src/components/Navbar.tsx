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
import { Menu, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
        <div className="flex items-center gap-4">
          {/* Barra de Pesquisa */}
          <div className="hidden md:block">
            <SearchBar onSearch={onSearch} />
          </div>

          {/* Botão de Ajuda */}
          {user && (
            <div className="flex items-center">
              <HelpButton />
            </div>
          )}

          {/* Ações do Usuário */}
          <div className="flex items-center">
            <UserAction isAuthenticated={!!user} />
          </div>

          {/* Menu Mobile */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-[50px] w-[50px] text-white hover:text-netflix-red"
              onClick={toggleMobileMenu}
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
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

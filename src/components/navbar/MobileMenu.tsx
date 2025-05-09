
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isAuthenticated: boolean;
  navigationLinks: { path: string; label: string; icon: React.ReactNode }[];
}

const MobileMenu = ({ isAuthenticated, navigationLinks }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isRouteActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-16 bg-black/95 z-50 p-4 border-t border-gray-800">
          <nav>
            <ul className="flex flex-col space-y-4">
              {navigationLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center py-2 transition duration-300 ${
                      isRouteActive(link.path)
                        ? "text-netflix-red font-medium"
                        : "text-white hover:text-netflix-red"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon}
                    <span className="ml-1">{link.label}</span>
                  </Link>
                </li>
              ))}
              
              {isAuthenticated && (
                <li>
                  <Link
                    to="/favoritos"
                    className={`flex items-center py-2 transition duration-300 ${
                      isRouteActive('/favoritos')
                        ? "text-netflix-red font-medium"
                        : "text-white hover:text-netflix-red"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="ml-1">Meus Favoritos</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;


import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileMenuProps {
  isAuthenticated: boolean;
  navigationLinks: { path: string; label: string; icon: React.ReactNode }[];
}

const MobileMenu = ({ isAuthenticated, navigationLinks }: MobileMenuProps) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isRouteActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
          >
            <Menu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-netflix-background border-netflix-gray w-[80%] p-0">
          <SheetHeader className="p-4 border-b border-netflix-gray/20">
            <SheetTitle className="text-white">Menu</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <ul className="flex flex-col space-y-4 px-4">
              {navigationLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center py-2 transition duration-300 ${
                      isRouteActive(link.path)
                        ? "text-netflix-red font-medium"
                        : "text-white hover:text-netflix-red"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.icon}
                    <span className="ml-2">{link.label}</span>
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
                    onClick={() => setOpen(false)}
                  >
                    <Heart className="mr-1 h-4 w-4" />
                    <span className="ml-2">Meus Favoritos</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;

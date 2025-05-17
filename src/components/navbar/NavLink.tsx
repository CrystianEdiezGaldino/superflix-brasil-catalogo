
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { pauseDoramasProcessing } from "@/services/doramas";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  checkActive?: (path: string, currentPath: string) => boolean;
}

const NavLink = ({ to, children, checkActive }: NavLinkProps) => {
  const location = useLocation();
  
  const isRouteActive = (path: string) => {
    if (checkActive) {
      return checkActive(path, location.pathname);
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleClick = () => {
    // Cancela o processamento de doramas se estiver na rota de doramas
    if (location.pathname === '/doramas') {
      pauseDoramasProcessing();
    }
  };

  const active = isRouteActive(to);

  return (
    <li>
      <Link
        to={to}
        onClick={handleClick}
        className={`relative flex items-center text-sm lg:text-base transition duration-300 py-1.5 px-1 group
          ${active
            ? "text-white font-medium"
            : "text-white/70 hover:text-white"
          }`}
      >
        {children}
        <span 
          className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 
            ${active 
              ? "scale-x-100 bg-netflix-red" 
              : "scale-x-0 bg-white/40 group-hover:scale-x-100"
            }`}
        />
      </Link>
    </li>
  );
};

export default NavLink;

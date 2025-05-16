
import React from "react";
import { Link, useLocation } from "react-router-dom";

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

  return (
    <li>
      <Link
        to={to}
        className={`relative flex items-center text-sm lg:text-base transition duration-300 py-1.5 px-1 
          ${isRouteActive(to)
            ? "text-white font-medium"
            : "text-white/70 hover:text-white"
          }`}
      >
        {children}
        <span 
          className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 
            ${isRouteActive(to) 
              ? "scale-x-100 bg-netflix-red" 
              : "scale-x-0 bg-white/40 group-hover:scale-x-100"
            }`}
        />
      </Link>
    </li>
  );
};

export default NavLink;

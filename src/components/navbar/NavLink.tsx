
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
        className={`flex items-center transition duration-300 border-b-2 ${
          isRouteActive(to)
            ? "text-white font-medium border-netflix-red"
            : "text-white/80 hover:text-white border-transparent hover:border-white/30"
        } py-1`}
      >
        {children}
      </Link>
    </li>
  );
};

export default NavLink;

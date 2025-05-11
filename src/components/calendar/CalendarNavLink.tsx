
import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarNavLinkProps {
  href: string;
  isActive?: boolean;
  className?: string;
}

const CalendarNavLink = ({ href, isActive, className }: CalendarNavLinkProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-1 text-sm transition-colors hover:text-white",
        isActive ? "text-white font-medium" : "text-gray-300",
        className
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <CalendarDays size={16} />
      <span className="hidden md:inline">Calendário</span>
    </Link>
  );
};

export default CalendarNavLink;

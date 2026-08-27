import { useEffect, useRef, useState } from "react";
import {
  Menu,
  LayoutDashboard,
  CreditCard,
  FileText,
  Group,
  X,
} from "lucide-react";

import Button from "@/shared/system/Button";
import Typography from "@/shared/system/Typography";

const NAV_ITEMS = [
  {
    label: "Overview",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Transactions",
    to: "/transactions",
    icon: CreditCard,
  },
  {
    label: "Budget Plan",
    to: "/plan",
    icon: FileText,
  },
  {
    label: "Money Groups",
    to: "/groups",
    icon: Group,
  },
];

export const FloatingNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close with Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className="
        fixed
        left-4
        top-4
        z-[60]
        md:hidden
      "
    >
      {/* Menu button */}
      <div
        className="
         flex
          items-center
          justify-center
          rounded-full
          border
          border-gray-200/80
          bg-white/85
          p-1.5
          shadow-lg
          shadow-gray-900/5
          backdrop-blur-xl
          dark:border-gray-800/80
          dark:bg-gray-900/85
          dark:shadow-black/20
          gap-3
          pr-5
        "
      >
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
          className="relative rounded-full"
        >
          <span className="relative flex h-5 w-5 items-center justify-center">
            {/* Menu */}
            <Menu
              size={20}
              className={`
        absolute
        transition-all
        duration-200
        ease-in-out
        ${
          isOpen
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }
      `}
            />

            {/* X */}
            <X
              size={20}
              className={`
        absolute
        transition-all
        duration-200
        ease-in-out
        ${
          isOpen
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }
      `}
            />
          </span>
        </Button>
        <Typography variant="h3" className=" tracking-tighter">
          Fin<span className="text-primary-500">pal</span>
        </Typography>
      </div>

      {/* Navigation popover */}
      {isOpen && (
        <div
          className="
            absolute
            left-0
            top-[calc(100%+0.75rem)]
            w-56
            overflow-hidden
            rounded-2xl
            border
            border-gray-200/80
            bg-white/95
            p-2
            shadow-2xl
            shadow-gray-900/10
            backdrop-blur-xl
            dark:border-gray-800/80
            dark:bg-gray-950/95
            dark:shadow-black/30
            animate-fade-in
          "
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavItem
                key={item.to}
                item={item}
                Icon={Icon}
                onNavigate={() => setIsOpen(false)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

import { NavLink } from "react-router-dom";

const NavItem = ({ item, Icon, onNavigate }) => {
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) => `
        flex
        items-center
        gap-3
        rounded-xl
        px-3
        py-3
        text-sm
        font-bold
        transition-all
        duration-200

        ${
          isActive
            ? `
              bg-primary-50
              text-primary-600
              dark:bg-primary-900/20
              dark:text-primary-400
            `
            : `
              text-gray-600
              hover:bg-gray-100
              hover:text-gray-900
              dark:text-gray-300
              dark:hover:bg-gray-800
              dark:hover:text-white
            `
        }
      `}
    >
      <Icon size={18} />

      <span>{item.label}</span>
    </NavLink>
  );
};

import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Group,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import Button from "@/shared/system/Button";
import Typography from "@/shared/system/Typography";

const NAV_ITEMS = [
  {
    to: "/dashboard",
    icon: LayoutDashboard,
    label: "Overview",
  },
  {
    to: "/transactions",
    icon: CreditCard,
    label: "Transactions",
  },
  {
    to: "/plan",
    icon: FileText,
    label: "Budget Plan",
  },
  {
    to: "/groups",
    icon: Group,
    label: "Money Groups",
  },
];

export const Sidebar = ({ isCollapsed, onToggle }) => {
  return (
    <aside
      className={`
        hidden
        md:flex
        fixed
        left-4
        top-4
        bottom-4
        z-50
        flex-col

        rounded-[2rem]
        border
        border-gray-200/80
        bg-white/90
        shadow-xl
        shadow-gray-900/5
        backdrop-blur-xl

        dark:border-gray-800/80
        dark:bg-gray-900/90
        dark:shadow-black/20

        transition-all
        duration-300
        ease-in-out

        ${isCollapsed ? "w-[5rem]" : "w-[15rem]"}
      `}
    >
      <div
        className={`
          flex
          h-full
          flex-col
          ${isCollapsed ? "p-3" : "p-4"}
        `}
      >
        {/* =====================================================
            BRAND
        ====================================================== */}
        <div
          className={`
            flex
            items-center
            mb-8
            ${isCollapsed ? "justify-center" : "px-1"}
          `}
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-primary-500
                shadow-lg
                shadow-primary-500/20
              "
            >
              <img
                src="/icon-192x192.png"
                alt="FinPal Logo"
                className="
                  h-7
                  w-7
                  object-contain
                  brightness-0
                  invert
                "
              />
            </div>

            {!isCollapsed && (
              <Typography
                variant="h2"
                className="
                  whitespace-nowrap
                  tracking-tighter
                  animate-fade-in
                "
              >
                Fin<span className="text-primary-500">pal</span>
              </Typography>
            )}
          </div>
        </div>

        {/* =====================================================
            NAVIGATION
        ====================================================== */}
        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) => `
                  group
                  flex
                  items-center
                  rounded-2xl
                  font-bold
                  transition-all
                  duration-200

                  ${
                    isCollapsed
                      ? "h-12 w-12 justify-center mx-auto"
                      : "gap-4 px-4 py-3.5"
                  }

                  ${
                    isActive
                      ? `
                        bg-primary-500
                        text-white
                        shadow-lg
                        shadow-primary-500/20
                      `
                      : `
                        text-gray-500
                        hover:bg-gray-100
                        hover:text-gray-900
                        dark:text-gray-400
                        dark:hover:bg-gray-800/60
                        dark:hover:text-white
                      `
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={21}
                      strokeWidth={isActive ? 2.5 : 2}
                      className={`
                        shrink-0
                        transition-transform
                        duration-200
                        group-hover:scale-110

                        ${
                          isActive
                            ? "text-white"
                            : "text-gray-400 group-hover:text-primary-500"
                        }
                      `}
                    />

                    {!isCollapsed && (
                      <span className="truncate tracking-tight">
                        {item.label}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* =====================================================
            COLLAPSE BUTTON
        ====================================================== */}
        <div
          className={`
            pt-4
            border-t
            border-gray-100
            dark:border-gray-800

            ${isCollapsed ? "flex justify-center" : ""}
          `}
        >
          <Button
            size={isCollapsed ? "icon-sm" : "sm"}
            variant="ghost"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={onToggle}
            leftIcon={
              isCollapsed ? (
                <PanelLeftOpen size={19} />
              ) : (
                <PanelLeftClose size={19} />
              )
            }
            className={`
              rounded-xl
              ${isCollapsed ? "h-10 w-10" : "w-full justify-start"}
            `}
          >
            {!isCollapsed && "Collapse"}
          </Button>
        </div>
      </div>
    </aside>
  );
};

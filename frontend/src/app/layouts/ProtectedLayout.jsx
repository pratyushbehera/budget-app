import { Outlet } from "react-router-dom";

import { Sidebar } from "../../shared/components/Sidebar";
import { FloatingNavigation } from "../../shared/components/FloatingNavigation";
import { FloatingUserMenu } from "../../shared/components/FloatingUserMenu";
import { useState } from "react";

const ProtectedLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  return (
    <div className="min-h-screen">
      {/* Desktop navigation */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Mobile navigation */}
      <FloatingNavigation />

      {/* Main content */}
      <main
        className={`
          min-h-screen
          bg-gray-50
          p-4
          dark:bg-gray-950
          sm:p-6
          transition-[padding-left]
    duration-300
    ease-in-out
          ${isSidebarCollapsed ? "md:pl-[5rem]" : "md:pl-[17rem]"}
        `}
      >
        <Outlet />
      </main>

      {/* Global user controls */}
      <FloatingUserMenu />
    </div>
  );
};

export default ProtectedLayout;

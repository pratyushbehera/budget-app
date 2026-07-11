import { Outlet } from "react-router-dom";

import { Sidebar } from "../../shared/components/Sidebar";
import { FloatingNavigation } from "../../shared/components/FloatingNavigation";
import { FloatingUserMenu } from "../../shared/components/FloatingUserMenu";
import { FloatingBrand } from "../../shared/components/FloatingBrand";

const ProtectedLayout = () => {
  return (
    <div className="min-h-screen">
      {/* Desktop navigation */}
      <Sidebar />

      {/* Mobile navigation */}
      <FloatingNavigation />
      <FloatingBrand />

      {/* Main content */}
      <main
        className="
          min-h-screen
          bg-gray-50
          p-4
          dark:bg-gray-950
          sm:p-6
          md:ml-[18rem]
        "
      >
        <Outlet />
      </main>

      {/* Global user controls */}
      <FloatingUserMenu />
    </div>
  );
};

export default ProtectedLayout;

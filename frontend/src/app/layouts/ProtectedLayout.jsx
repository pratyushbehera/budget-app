import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../../shared/components/Sidebar";

const ProtectedLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;

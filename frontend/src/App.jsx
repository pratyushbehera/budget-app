import React from "react";
import { ToastContainer } from "./shared/components/ToastContainer";
import "./styles/globals.css";
import { AppProviders } from "./app/providers/AppProviders";
import { AppRoutes } from "./app/routes/AppRoutes";
import { CategoryProvider } from "./app/providers/CategoryProvider";
import { GroupProvider } from "./app/providers/GroupProvider";
import { PWAInstallPrompt } from "./shared/components/PWAInstallPrompt";

function App() {
  return (
    <AppProviders>
      <CategoryProvider>
        <GroupProvider>
          <div className="min-h-screen bg-white dark:bg-gray-50 text-gray-900 dark:text-gray-100">
            <PWAInstallPrompt />
            <AppRoutes />
            <ToastContainer />
          </div>
        </GroupProvider>
      </CategoryProvider>
    </AppProviders>
  );
}

export default App;

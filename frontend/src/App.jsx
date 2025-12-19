import React from "react";
import { NotificationContainer } from "./shared/components/NotificationContainer";
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
            <NotificationContainer />
          </div>
        </GroupProvider>
      </CategoryProvider>
    </AppProviders>
  );
}

export default App;

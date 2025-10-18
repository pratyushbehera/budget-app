import { useEffect, useCallback } from "react";
import { useApp } from "../store";
import { Header } from "../../widgets/header";
import { Tabs, TabContent } from "../../widgets/tabs";
import { DashboardPage } from "../../pages/dashboard";
import { TransactionsPage } from "../../pages/transactions";
import { PlansPage } from "../../pages/plans";
import { InsightsPage } from "../../pages/insights";
import { AuthPage } from "../../pages/auth";
import { DeleteConfirmationModal } from "../../features/delete-transaction";
import { transactionAPI, plansAPI, insightsAPI } from "../../shared/api";
import { offlineStorage } from "../../shared/lib/offline-storage";

export function App() {
  const { state, actions } = useApp();
  const { isAuthenticated, currentYear, currentMonth, activeTab } = state;

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {
      const token = state.userToken;
      const authFetch = async (url, options = {}) => {
        const headers = {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        };

        const response = await fetch(url, { ...options, headers });

        if (response.status === 401) {
          actions.logoutUser();
          throw new Error("Unauthorized: Please log in again.");
        }

        return response;
      };

      const transactions = await transactionAPI.fetchAll(authFetch);
      actions.setTransactions(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [state.userToken, actions]);

  // Fetch plans
  const fetchPlans = useCallback(async () => {
    try {
      const token = state.userToken;
      const authFetch = async (url, options = {}) => {
        const headers = {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        };

        const response = await fetch(url, { ...options, headers });

        if (response.status === 401) {
          actions.logoutUser();
          throw new Error("Unauthorized: Please log in again.");
        }

        return response;
      };

      const plans = await plansAPI.fetchAll(authFetch);
      actions.setPlans(plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  }, [state.userToken, actions]);

  // Fetch insight
  const fetchInsight = useCallback(async () => {
    try {
      const token = state.userToken;
      const authFetch = async (url, options = {}) => {
        const headers = {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        };

        const response = await fetch(url, { ...options, headers });

        if (response.status === 401) {
          actions.logoutUser();
          throw new Error("Unauthorized: Please log in again.");
        }

        return response;
      };

      const insight = await insightsAPI.fetch(
        authFetch,
        currentYear,
        currentMonth,
      );
      actions.setInsight(insight);
    } catch (error) {
      console.error("Error fetching insight:", error);
      actions.setInsight("Failed to load previous insight.");
    }
  }, [state.userToken, actions, currentYear, currentMonth]);

  // Sync offline actions
  const syncOfflineActions = useCallback(async () => {
    const offlineActions = offlineStorage.getOfflineActions();
    if (offlineActions.length === 0) return;

    const successfulActionIndices = [];
    const token = state.userToken;

    for (let i = 0; i < offlineActions.length; i++) {
      const action = offlineActions[i];
      try {
        const authFetch = async (url, options = {}) => {
          const headers = {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
          };

          const response = await fetch(url, { ...options, headers });

          if (response.status === 401) {
            actions.logoutUser();
            throw new Error("Unauthorized: Please log in again.");
          }

          return response;
        };

        let response;

        if (action.type === "addTransaction") {
          response = await transactionAPI.create(authFetch, action.payload);
        } else if (action.type === "removeTransaction") {
          response = await transactionAPI.delete(authFetch, action.payload.id);
        } else if (action.type === "updatePlans") {
          response = await plansAPI.update(authFetch, action.payload);
        }

        if (response) {
          successfulActionIndices.push(i);
        }
      } catch (error) {
        console.error(
          "Network error during offline action sync:",
          action,
          error,
        );
      }
    }

    // Remove successfully synced actions
    offlineStorage.removeOfflineActions(successfulActionIndices);

    // Refetch data after sync
    if (successfulActionIndices.length > 0) {
      // Call the functions directly instead of using the callbacks to avoid circular dependency
      try {
        const authFetch = async (url, options = {}) => {
          const headers = {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
          };

          const response = await fetch(url, { ...options, headers });

          if (response.status === 401) {
            actions.logoutUser();
            throw new Error("Unauthorized: Please log in again.");
          }

          return response;
        };

        const transactions = await transactionAPI.fetchAll(authFetch);
        actions.setTransactions(transactions);
        const plans = await plansAPI.fetchAll(authFetch);
        actions.setPlans(plans);
      } catch (error) {
        console.error("Error refetching data after sync:", error);
      }
    }
  }, [state.userToken, actions]);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Loading initial data...");
      fetchTransactions();
      fetchPlans();
    }
  }, [isAuthenticated, fetchTransactions, fetchPlans]);

  // Fetch insight when insights tab is active
  useEffect(() => {
    if (activeTab === "insights" && isAuthenticated) {
      fetchInsight();
    }
  }, [activeTab, currentMonth, currentYear, fetchInsight, isAuthenticated]);

  // Sync offline actions when online
  useEffect(() => {
    if (isAuthenticated && navigator.onLine) {
      syncOfflineActions();
    }
  }, [isAuthenticated, syncOfflineActions]);

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <Header />

        <Tabs>
          <TabContent value="dashboard">
            <DashboardPage />
          </TabContent>

          <TabContent value="transactions">
            <TransactionsPage />
          </TabContent>

          <TabContent value="plans">
            <PlansPage />
          </TabContent>

          <TabContent value="insights">
            <InsightsPage />
          </TabContent>
        </Tabs>

        <footer className="text-center text-sm text-gray-500 mt-6">
          Built for quick budgeting.
        </footer>
      </div>

      <DeleteConfirmationModal />
    </div>
  );
}

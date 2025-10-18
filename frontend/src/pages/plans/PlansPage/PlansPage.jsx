import { useApp } from "../../../app/store";
import { SummaryTable } from "../../../components/SummaryTable";
import { offlineStorage } from "../../../shared/lib/offline-storage";
import {
  filterTransactionsByMonth,
  calculateSumsByCategory,
  calculateIncomeTotal,
  calculateExpenseTotal,
} from "../../../shared/lib/calculations";

export function PlansPage() {
  const { state, actions } = useApp();
  const {
    transactions,
    currentYear,
    currentMonth,
    plans,
    hasPendingPlanChanges,
  } = state;

  // Filter transactions by current month and year
  const filteredTransactions = filterTransactionsByMonth(
    transactions,
    currentYear,
    currentMonth,
  );

  // Calculate financial data
  const sumsByCategory = calculateSumsByCategory(filteredTransactions);
  const incomeTotal = calculateIncomeTotal(sumsByCategory);
  const expenseTotal = calculateExpenseTotal(sumsByCategory);

  // Get monthly plans
  const monthlyPlans = plans[currentYear]?.[currentMonth] || {};

  const handleUpdatePlanned = (category, value) => {
    actions.updatePlan(category, value, currentYear, currentMonth);
  };

  const handleApplyPlans = async () => {
    if (!navigator.onLine) {
      // Store offline action
      offlineStorage.saveOfflineAction({ type: "updatePlans", payload: plans });
      actions.setHasPendingPlanChanges(false);
      console.log("Plan update saved offline.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/plans`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.userToken}`,
          },
          body: JSON.stringify({ data: plans }),
        },
      );

      if (response.ok) {
        console.log("Plans updated successfully");
        actions.setHasPendingPlanChanges(false);
      } else {
        throw new Error("Failed to update plans");
      }
    } catch (error) {
      console.error("Error updating plans:", error);
      // Store offline action
      offlineStorage.saveOfflineAction({ type: "updatePlans", payload: plans });
      actions.setHasPendingPlanChanges(false);
      console.log("Plan update saved offline.");
    }
  };

  const handleCopyPreviousMonthPlans = async () => {
    const currentMonthNum = parseInt(currentMonth, 10);
    const currentYearNum = parseInt(currentYear, 10);

    let prevMonthNum = currentMonthNum - 1;
    let prevYearNum = currentYearNum;

    if (prevMonthNum === 0) {
      prevMonthNum = 12;
      prevYearNum -= 1;
    }

    const prevMonth = String(prevMonthNum).padStart(2, "0");
    const prevYear = String(prevYearNum);

    try {
      // Create authenticated fetch function
      const authFetch = async (url, options = {}) => {
        const token = state.userToken;
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

      const response = await authFetch(
        `${import.meta.env.VITE_BACKEND_URL}/plans`,
      );
      if (!response.ok) throw new Error("Failed to fetch all plans for copy.");

      const allPlans = await response.json();
      const previousMonthPlans = allPlans[prevYear]?.[prevMonth] || {};

      // Update plans in state
      const updatedPlans = {
        ...plans,
        [currentYear]: {
          ...plans[currentYear],
          [currentMonth]: previousMonthPlans,
        },
      };

      actions.setPlans(updatedPlans);
      actions.setHasPendingPlanChanges(true);

      console.log(
        "Plans copied from previous month. Click Apply Changes to save.",
      );
    } catch (error) {
      console.error("Error copying previous month's plans:", error);
      alert("Failed to copy previous month's plans. Please try again.");
    }
  };

  return (
    <SummaryTable
      sumsByCategory={sumsByCategory}
      plans={monthlyPlans}
      updatePlanned={handleUpdatePlanned}
      incomeTotal={incomeTotal}
      expenseTotal={expenseTotal}
      hasPendingPlanChanges={hasPendingPlanChanges}
      applyPlans={handleApplyPlans}
      copyPreviousMonthPlans={handleCopyPreviousMonthPlans}
    />
  );
}

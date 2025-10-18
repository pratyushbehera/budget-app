import { useApp } from "../../../app/store";
import { InsightsTab } from "../../../components/InsightsTab";
import {
  filterTransactionsByMonth,
  calculateSumsByCategory,
  calculateIncomeTotal,
  calculateExpenseTotal,
  calculateSavings,
  calculateSavingsPercentage,
} from "../../../shared/lib/calculations";

export function InsightsPage() {
  const { state, actions } = useApp();
  const { transactions, currentYear, currentMonth, plans, insight, isLoading } =
    state;

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
  const savings = calculateSavings(incomeTotal, expenseTotal);
  const savingsPct = calculateSavingsPercentage(incomeTotal, savings);

  // Get monthly plans
  const monthlyPlans = plans[currentYear]?.[currentMonth] || {};

  const handleGenerateInsight = async () => {
    console.log("Generating insight...");
    actions.setInsight("Generating your AI-powered insight...");
    actions.setIsLoading(true);

    const prompt =
      `Generate a concise budget insight for ${currentMonth}/${currentYear}.\n\n` +
      "Planned amounts (categorized):\n" +
      `${JSON.stringify(monthlyPlans, null, 2)}\n\n` +
      "Actual spending (categorized):\n" +
      `${JSON.stringify(sumsByCategory, null, 2)}\n\n` +
      `Total Income: ${incomeTotal}\n` +
      `Total Expenses: ${expenseTotal}\n` +
      `Savings: ${savings}\n` +
      `Savings Percentage: ${savingsPct.toFixed(2)}%\n\n` +
      "Based on this data, provide an actionable insight about planning vs. spending, identify areas of overspending or underspending, and offer a recommendation. Keep it under 200 words.";

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
        `${import.meta.env.VITE_BACKEND_URL}/generate-insight`,
        {
          method: "POST",
          body: JSON.stringify({ prompt }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch insight from API.",
        );
      }

      const aiInsight = await response.json();
      actions.setInsight(aiInsight);

      // Save the generated insight to the database
      await authFetch(`${import.meta.env.VITE_BACKEND_URL}/insights`, {
        method: "POST",
        body: JSON.stringify({
          year: currentYear,
          month: currentMonth,
          content: aiInsight,
        }),
      });
    } catch (error) {
      console.error("Error generating insight:", error);
      actions.setInsight(
        `Failed to generate insight: ${error.message}. Please check your API key and server logs.`,
      );
    } finally {
      actions.setIsLoading(false);
    }
  };

  return (
    <InsightsTab
      monthlyPlans={monthlyPlans}
      incomeTotal={incomeTotal}
      expenseTotal={expenseTotal}
      savings={savings}
      savingsPct={savingsPct}
      generateInsight={handleGenerateInsight}
      insight={insight}
      isLoading={isLoading}
    />
  );
}

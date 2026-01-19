import { useQuery } from "@tanstack/react-query";
import { api } from "./apiClient";
import { fetchTransactionsByDateRange } from "./transactionApi";
import { splitWeeklyTransactions } from "../shared/utils/weeklyTransactions";

const ONE_DAY = 24 * 60 * 60 * 1000;

export const useWeeklyInsightsQuery = () => {
  return useQuery({
    queryKey: ["weekly-insights"],
    queryFn: async () => {
      const today = new Date();
      const endDate = today.toISOString().split("T")[0];

      const startDate = new Date();
      startDate.setDate(today.getDate() - 14);
      const startISO = startDate.toISOString().split("T")[0];

      // 1️⃣ Fetch transactions
      const res = await fetchTransactionsByDateRange({
        startDate: startISO,
        endDate,
      });

      const transactions = res || [];

      const { currentWeekTransactions, previousWeekTransactions } =
        splitWeeklyTransactions(transactions);
      console.log(res);
      // Guardrail: insufficient data
      if (
        currentWeekTransactions.length === 0 ||
        previousWeekTransactions.length === 0
      ) {
        return { content: [] };
      }

      // 2️⃣ Generate insights
      return api.post("/api/insights/generate", {
        currentWeekTransactions,
        previousWeekTransactions,
      });
    },

    // 🔐 Memoization controls
    staleTime: ONE_DAY, // 24h fresh
    cacheTime: ONE_DAY, // kept in memory
    refetchOnMount: false, // route re-entry safe
    refetchOnWindowFocus: false, // tab switch safe
    retry: 1,
  });
};

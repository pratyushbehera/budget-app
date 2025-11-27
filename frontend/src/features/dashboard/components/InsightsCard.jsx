import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlan } from "../../../services/planApi";
import { useTransaction } from "../../../services/transactionApi";

export const InsightsCardList = ({ selectedMonth, insightHook }) => {
  const { insights, isLoading, generate } = insightHook;
  const { data: transactions, isLoading: transactionLoading } = useTransaction({
    month: selectedMonth,
  });
  const { data: budgets, isLoading: planLoading } = usePlan();

  // Auto-generate if empty
  useEffect(() => {
    if (
      !isLoading &&
      !transactionLoading &&
      !planLoading &&
      insights.length === 0
    ) {
      if (Array.isArray(transactions)) generate(budgets, transactions);
    }
  }, [
    isLoading,
    insights,
    transactionLoading,
    planLoading,
    budgets,
    transactions,
  ]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className=" card p-4 flex justify-center items-center text-gray-500 dark:text-gray-300">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <div className="p-4 text-gray-600 dark:text-gray-300">
        No insights available yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
      {insights.map((ins, index) => (
        <div
          key={index}
          className=" card p-4 shadow-md dark:bg-gray-800 dark:text-white"
        >
          <h3 className="font-semibold text-lg">{ins.title}</h3>
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
            {ins.summary}
          </p>
          <div className="mt-3 text-xs font-medium text-indigo-600 dark:text-indigo-400">
            💡 {ins.suggestion}
          </div>
        </div>
      ))}
    </div>
  );
};

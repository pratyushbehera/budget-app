import { WeeklyInsightsCard } from "./WeeklyInsightsCard";

export function WeeklyInsightsList({ insights }) {
  if (!insights || insights.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Not enough data to generate weekly insights.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {insights.map((insight) => (
        <WeeklyInsightsCard key={insight.category} insight={insight} />
      ))}
    </div>
  );
}

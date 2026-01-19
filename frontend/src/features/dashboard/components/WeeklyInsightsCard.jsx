export function WeeklyInsightsCard({ insight }) {
  const isIncrease = insight.changePercent > 0;

  return (
    <div className="card rounded-lg border p-4 dark:border-gray-700">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-medium">{insight.category}</h4>
        <span
          className={`text-sm ${
            isIncrease ? "text-red-500" : "text-green-500"
          }`}
        >
          {isIncrease ? "↑" : "↓"} {Math.abs(insight.changePercent)}%
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        ₹{insight.totalSpent} this week
      </p>

      <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
        {insight.insight}
      </p>
    </div>
  );
}

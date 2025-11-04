import { useEffect, useState } from "react";

export const CategorySpendChart = ({ data }) => {
  const [showAll, setShowAll] = useState(false);
  const [chartData, setChartData] = useState([]);

  const visibleData = showAll
    ? chartData
    : chartData.sort((a, b) => b.percentUsed - a.percentUsed).slice(0, 5);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const mappedData = Object.entries(data).map(([key, value]) => ({
        category: key,
        planned: value.plannedAmount || 0,
        spent: value.spentAmount || 0,
        percentUsed: value.percentUsed || 0,
      }));
      setChartData(mappedData);
    } else {
      setChartData([]);
    }
  }, [data]);

  const hasData = chartData.length > 0;

  return (
    <div className="card p-4 col-span-4 md:col-span-2 flex flex-col justify-between">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Planned vs Actual Spend
      </h3>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm mb-2">No spending data available yet</p>
          <p className="text-xs max-w-xs">
            Once you set your budget and record expenses, you’ll see how your
            spending compares to your plan.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {visibleData?.map((item) => (
              <div key={item.category}>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
                  <span>{item.category}</span>
                  <span>{item.percentUsed.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500`}
                    style={{
                      width: `${item.percentUsed}%`,
                      background:
                        item.percentUsed > 90
                          ? "linear-gradient(to right, #f43f5e, #fb923c)" // overspent red/orange
                          : "linear-gradient(to right, #3b82f6, #06b6d4)", // normal blue/teal
                    }}
                  ></div>
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  ₹{item?.spent?.toLocaleString()} / ₹
                  {item?.planned?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowAll((s) => !s)}
            className="text-xs text-primary-600 hover:underline mt-3 self-end"
          >
            {showAll ? "Show Less ↑" : "Show More ↓"}
          </button>
        </>
      )}
    </div>
  );
};

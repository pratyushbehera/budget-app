import { useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

export const CategorySpendChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const sortedData = [...chartData].sort(
    (a, b) => b.percentUsed - a.percentUsed
  );
  const visibleData = isFullscreen ? sortedData : sortedData.slice(0, 5);

  return (
    <>
      {/* Background overlay for fullscreen */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"></div>
      )}

      <div
        className={`card p-4 transition-all duration-300 ${
          isFullscreen
            ? "fixed inset-4 z-50 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto"
            : "col-span-4 md:col-span-2"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Planned vs Actual Spend
          </h3>

          <button
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 size={18} strokeWidth={1.8} />
            ) : (
              <Maximize2 size={18} strokeWidth={1.8} />
            )}
          </button>
        </div>

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
              {visibleData.map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
                    <span>{item.category}</span>
                    <span>{item.percentUsed.toFixed(1)}%</span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentUsed}%`,
                        background:
                          item.percentUsed > 90
                            ? "linear-gradient(to right, #f43f5e, #fb923c)"
                            : "linear-gradient(to right, #3b82f6, #06b6d4)",
                      }}
                    ></div>
                  </div>

                  <div className="text-[11px] text-gray-400 mt-0.5">
                    ₹{item.spent.toLocaleString()} / ₹
                    {item.planned.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {!isFullscreen && (
              <p className="text-[11px] text-gray-400 mt-3 text-right">
                Showing top 5 categories
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
};

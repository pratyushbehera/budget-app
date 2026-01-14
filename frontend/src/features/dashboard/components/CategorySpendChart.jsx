import { useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

export const CategorySpendChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const mappedData = Object.entries(data).map(([key, value]) => {
        const planned = Number(value.plannedAmount || 0);
        const spent = Number(value.spentAmount || 0);

        let percentUsed = 0;
        let isUnplanned = false;

        if (planned === 0 && spent > 0) {
          percentUsed = 100; // ✅ force visible bar
          isUnplanned = true;
        } else if (planned > 0) {
          percentUsed = (spent / planned) * 100;
        }

        return {
          category: key,
          planned,
          spent,
          percentUsed,
          isUnplanned,
        };
      });

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
            <div className={`space-y-3 ${isFullscreen ? "mx-4 mt-4" : ""}`}>
              {visibleData.map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
                    <span>{item.category}</span>
                    {item.isUnplanned
                      ? "Unplanned"
                      : `${item.percentUsed.toFixed(1)}%`}
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(item.percentUsed, 100)}%`,
                        background: item.isUnplanned
                          ? "linear-gradient(to right, #7c2d12, #dc2626)" // dark red
                          : item.percentUsed > 90
                          ? "linear-gradient(to right, #f43f5e, #fb923c)"
                          : "linear-gradient(to right, #3b82f6, #06b6d4)",
                      }}
                    ></div>
                  </div>

                  <div className="text-[11px] text-gray-400 mt-0.5">
                    ₹{item.spent.toLocaleString()}{" "}
                    {item.planned > 0
                      ? `/ ₹${item.planned.toLocaleString()}`
                      : "(no plan)"}
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

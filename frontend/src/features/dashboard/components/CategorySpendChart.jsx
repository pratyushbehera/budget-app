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
        className={`card p-6 transition-all duration-300 ${
          isFullscreen
            ? "fixed inset-4 z-50 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto rounded-3xl"
            : "col-span-4 md:col-span-2 rounded-3xl shadow-md border-none bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Planned vs Actual Spend
          </h3>

          <button
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-all"
          >
            {isFullscreen ? (
              <Minimize2 size={20} strokeWidth={2} />
            ) : (
              <Maximize2 size={20} strokeWidth={2} />
            )}
          </button>
        </div>

        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400">
            <p className="text-base font-medium mb-2">No spending data available yet</p>
            <p className="text-sm max-w-xs opacity-70">
              Once you set your budget and record expenses, you’ll see how your
              spending compares to your plan.
            </p>
          </div>
        ) : (
          <>
            <div className={`space-y-6 ${isFullscreen ? "mx-4 mt-4" : ""}`}>
              {visibleData.map((item) => (
                <div key={item.category} className="group">
                  <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    <span className="tracking-tight">{item.category}</span>
                    <span className={item.percentUsed > 100 ? "text-tertiary-500" : "text-primary-500"}>
                      {item.isUnplanned
                        ? "Unplanned"
                        : `${item.percentUsed.toFixed(0)}%`}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                    <div
                      className="h-4 rounded-full transition-all duration-700 ease-out group-hover:brightness-110"
                      style={{
                        width: `${Math.min(item.percentUsed, 100)}%`,
                        background: item.isUnplanned
                          ? "linear-gradient(to right, #be123c, #fb7185)" // Rose/Rose
                          : item.percentUsed > 90
                          ? "linear-gradient(to right, #f59e0b, #f43f5e)" // Amber to Rose
                          : "linear-gradient(to right, #10b981, #6366f1)", // Emerald to Indigo
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-[12px] font-medium text-gray-400 mt-2">
                    <span>Spent: ₹{item.spent.toLocaleString()}</span>
                    <span>
                      {item.planned > 0
                        ? `Goal: ₹${item.planned.toLocaleString()}`
                        : "(no plan)"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {!isFullscreen && chartData.length > 5 && (
              <p className="text-[12px] font-semibold text-primary-500 mt-6 text-center cursor-pointer hover:underline" onClick={() => setIsFullscreen(true)}>
                View all {chartData.length} categories
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
};

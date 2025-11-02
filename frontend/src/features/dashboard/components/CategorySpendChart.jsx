import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const CategorySpendChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const mappedData = Object.entries(data).map(([key, value]) => ({
        category: key,
        Planned: value.plannedAmount || 0,
        Spent: value.spentAmount || 0,
        percentUsed: value.percentUsed || 0,
      }));
      setChartData(mappedData);
    } else {
      setChartData([]);
    }
  }, [data]);

  const hasData = chartData.length > 0;

  return (
    <div className="card p-4 col-span-2 row-span-2 flex flex-col justify-between">
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
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickFormatter={(val) => `₹${val.toLocaleString()}`}
            />
            <YAxis
              dataKey="category"
              type="category"
              width={110}
              tick={{ fill: "#6b7280", fontSize: 10 }}
            />
            <Tooltip
              formatter={(value, name) => [`₹${value.toLocaleString()}`, name]}
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.9)",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: "12px",
                color: "#6b7280",
              }}
            />
            <Bar
              dataKey="Planned"
              fill="#93c5fd" // light blue
              radius={[4, 4, 4, 4]}
              barSize={14}
            />
            <Bar
              dataKey="Spent"
              fill="#2563eb" // darker blue
              radius={[4, 4, 4, 4]}
              barSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

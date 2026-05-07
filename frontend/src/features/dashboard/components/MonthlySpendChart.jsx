import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { convertToShortForm } from "../../../shared/utils/formatCurrency";

export const MonthlySpendCard = ({ monthlyTrend }) => {
  if (!monthlyTrend) return null;

  const { labels, spend, income, yoy, trend } = monthlyTrend;

  const data = labels.map((label, i) => ({
    month: label,
    spend: spend[i],
    income: income[i],
  }));

  const trendIcon = (dir, isPositiveGood = true) => {
    if (dir === "up")
      return isPositiveGood ? (
        <ArrowUpRight className="text-green-500" size={14} />
      ) : (
        <ArrowUpRight className="text-red-500" size={14} />
      );
    if (dir === "down")
      return isPositiveGood ? (
        <ArrowDownRight className="text-green-500" size={14} />
      ) : (
        <ArrowDownRight className="text-red-500" size={14} />
      );
    return <Minus size={14} className="text-gray-400" />;
  };

  return (
    <div className="col-span-4 rounded-3xl bg-white dark:bg-gray-950/40 p-6 shadow-md border backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Monthly Income vs Spend
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-1">Last 6 months overview</p>
        </div>

        <div className="text-xs space-y-2 text-right">
          <div className="flex items-center gap-2 justify-end bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-full">
            {trendIcon(trend.spend, false)}
            <span className="font-bold text-gray-700 dark:text-gray-200">
              Spend {trend.spend}
            </span>
          </div>
          {yoy.spendChangePercent !== null && (
            <div className="text-gray-400 font-medium px-2">YoY: {yoy.spendChangePercent}%</div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <XAxis
              dataKey="month"
              tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tickFormatter={(v) => `₹${convertToShortForm(v)}`}
              tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip
              contentStyle={{ 
                borderRadius: "16px", 
                border: "none", 
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(8px)",
              }}
              formatter={(val, name) => [`₹${val.toLocaleString()}`, name.charAt(0).toUpperCase() + name.slice(1)]}
            />
            <Legend verticalAlign="top" height={36}/>
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981" // Primary M3 Emerald
              strokeWidth={4}
              dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="spend"
              stroke="#f43f5e" // Tertiary M3 Rose
              strokeWidth={4}
              dot={{ r: 4, fill: "#f43f5e", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

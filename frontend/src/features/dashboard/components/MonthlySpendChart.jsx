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
    <div className="col-span-4 card p-4 shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Monthly Income vs Spend
        </h3>

        <div className="text-xs space-y-1 text-right">
          <div className="flex items-center gap-1 justify-end">
            {trendIcon(trend.spend, false)}
            <span className="text-gray-600 dark:text-gray-300">
              Spend {trend.spend}
            </span>
          </div>
          {yoy.spendChangePercent !== null && (
            <div className="text-gray-400">YoY: {yoy.spendChangePercent}%</div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="month"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(v) => `₹${convertToShortForm(v)}`}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={false}
            />
            <Tooltip
              formatter={(val, name) => [`₹${val.toLocaleString()}`, name]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="spend"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

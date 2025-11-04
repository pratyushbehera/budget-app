import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const MonthlySpendCard = ({ monthlySpend = [], monthlyIncome = [] }) => {
  const data = monthlySpend.map((spend, i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "short" }),
    spend: spend,
    income: monthlyIncome[i] || 0,
  }));

  const hasData = data.length > 0 && data.some((d) => d.spend > 0);

  return (
    <div className="col-span-4 card p-4 shadow-sm flex flex-col">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Monthly Income vs Spend
      </h3>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-gray-500">
          <p className="text-sm mb-1">No monthly data yet</p>
          <p className="text-xs">Start adding transactions to see trends</p>
        </div>
      ) : (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="month"
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(val) => `₹${val.toLocaleString()}`}
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={false}
              />
              <Tooltip
                formatter={(val, name) => [`₹${val.toLocaleString()}`, name]}
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", marginTop: 4 }}
                verticalAlign="top"
                height={24}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="spend"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

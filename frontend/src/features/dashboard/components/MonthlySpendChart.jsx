import { LineChart, Line, ResponsiveContainer } from "recharts";
import { FLAT_COLORS } from "../../../shared/constants/constants";

export const MonthlySpendCard = ({ monthlySpend }) => {
  const data = monthlySpend?.map((value, i) => ({ month: i + 1, value }));
  return (
    <div className="col-span-2 card p-4  shadow-sm">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
        Monthly Spend
      </h3>

      <div className="h-20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={FLAT_COLORS[1]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

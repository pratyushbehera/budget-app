import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

export function MonthlySpendTrendChart({ monthlyTrend }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">Monthly Spend Trend</h3>
            <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                    <BarChart data={monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="expense" fill="#EF4444" name="Spend" />
                        <Bar dataKey="income" fill="#10B981" name="Income" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

MonthlySpendTrendChart.propTypes = {
    monthlyTrend: PropTypes.array.isRequired,
};

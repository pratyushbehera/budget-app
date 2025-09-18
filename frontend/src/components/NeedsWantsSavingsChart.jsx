import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { FLAT_COLORS } from "../utils/constants";
import { formatCurrency } from "../utils/helpers";

export function NeedsWantsSavingsChart({ pieData, needsBreakdown, wantsBreakdown, savingsBreakdown }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">Needs vs Wants vs Savings</h3>
            <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie dataKey="value" data={pieData} outerRadius={80} label>
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={FLAT_COLORS[index % FLAT_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm">
                <h4 className="font-semibold mb-2">50/30/20 Rule Breakdown:</h4>
                <div className="space-y-1">
                    <div className="flex justify-between">
                        <span>Needs (50%):</span>
                        <span>Allocated: {formatCurrency(needsBreakdown.allocated)} | Spent: {formatCurrency(needsBreakdown.actual)} | Remaining: {formatCurrency(needsBreakdown.remaining)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Wants (20%):</span>
                        <span>Allocated: {formatCurrency(wantsBreakdown.allocated)} | Spent: {formatCurrency(wantsBreakdown.actual)} | Remaining: {formatCurrency(wantsBreakdown.remaining)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Savings (30%):</span>
                        <span>Allocated: {formatCurrency(savingsBreakdown.allocated)} | Saved: {formatCurrency(savingsBreakdown.actual)} | Remaining: {formatCurrency(savingsBreakdown.remaining)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

NeedsWantsSavingsChart.propTypes = {
    pieData: PropTypes.array.isRequired,
    needsBreakdown: PropTypes.object.isRequired,
    wantsBreakdown: PropTypes.object.isRequired,
    savingsBreakdown: PropTypes.object.isRequired,
};
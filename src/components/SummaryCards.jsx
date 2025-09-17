import React from "react";
import { formatCurrency } from "../utils/helpers";

export function SummaryCards({ incomeTotal, expenseTotal, savings, savingsPct, plans }) {
    return (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Total Income</div>
                <div className="text-xl font-semibold mt-1">{formatCurrency(incomeTotal)}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Total Expenses</div>
                <div className="text-xl font-semibold mt-1">{formatCurrency(expenseTotal)}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Savings</div>
                <div className="text-xl font-semibold mt-1">{formatCurrency(savings)}</div>
                <div className="text-xs text-gray-400">{savingsPct.toFixed(1)}% of income</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Planned vs Actual</div>
                <div className="mt-2 text-sm text-gray-700">You have {Object.keys(plans).filter(k => plans[k] > 0).length} planned items</div>
            </div>
        </section>
    );
}

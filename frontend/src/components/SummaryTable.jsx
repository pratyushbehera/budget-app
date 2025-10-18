import PropTypes from "prop-types";
import React from "react";
import { formatCurrency } from "../utils/helpers";
import { DEFAULT_CATEGORIES } from "../utils/constants";

export function SummaryTable({
  sumsByCategory,
  plans,
  updatePlanned,
  incomeTotal,
  expenseTotal,
  hasPendingPlanChanges,
  applyPlans,
  copyPreviousMonthPlans,
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow overflow-auto">
      <h3 className="font-semibold">Summary (Planned vs Actual)</h3>
      <div className="mt-3">
        <table className="min-w-full text-sm">
          <thead className="text-left text-gray-500">
            <tr>
              <th>Category</th>
              <th>Planned</th>
              <th>Actual</th>
              <th>Diff</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(DEFAULT_CATEGORIES).map(([section, items]) => (
              <React.Fragment key={section}>
                <tr className="bg-gray-100">
                  <td colSpan={4} className="py-2 font-semibold">
                    {section}
                  </td>
                </tr>
                {items.map((item) => {
                  const actual = sumsByCategory[item] || 0;
                  const planned = plans[item] || 0;
                  return (
                    <tr key={item} className="border-t">
                      <td className="py-1">{item}</td>
                      <td className="py-1">
                        <input
                          id={`planned-${item}`}
                          name={`planned-${item}`}
                          type="number"
                          value={planned === 0 ? "" : planned}
                          onChange={(e) => updatePlanned(item, e.target.value)}
                          className="w-28 p-1 border rounded"
                        />
                      </td>
                      <td className="py-1">{formatCurrency(actual)}</td>
                      <td className="py-1">
                        {formatCurrency(planned - actual)}
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}

            {/* totals row */}
            <tr className="border-t font-semibold">
              <td className="py-2">Totals</td>
              <td className="py-2">
                {formatCurrency(
                  Object.keys(plans)
                    .filter((k) => DEFAULT_CATEGORIES.Income.includes(k))
                    .reduce((s, k) => s + Number(plans[k] || 0), 0) -
                    Object.keys(plans)
                      .filter((k) => !DEFAULT_CATEGORIES.Income.includes(k))
                      .reduce((s, k) => s + Number(plans[k] || 0), 0),
                )}
              </td>
              <td className="py-2">
                {formatCurrency(incomeTotal - expenseTotal)}
              </td>
              <td className="py-2">
                {formatCurrency(
                  Object.keys(plans)
                    .filter((k) => DEFAULT_CATEGORIES.Income.includes(k))
                    .reduce((s, k) => s + Number(plans[k] || 0), 0) -
                    Object.keys(plans)
                      .filter((k) => !DEFAULT_CATEGORIES.Income.includes(k))
                      .reduce((s, k) => s + Number(plans[k] || 0), 0) -
                    (incomeTotal - expenseTotal),
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={copyPreviousMonthPlans}
            className="px-4 py-2 rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Copy Previous Month Plan
          </button>
          <button
            onClick={applyPlans}
            disabled={!hasPendingPlanChanges}
            className={`px-4 py-2 rounded shadow-sm text-white ${hasPendingPlanChanges ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}

SummaryTable.propTypes = {
  sumsByCategory: PropTypes.object.isRequired,
  plans: PropTypes.object.isRequired,
  updatePlanned: PropTypes.func.isRequired,
  incomeTotal: PropTypes.number.isRequired,
  expenseTotal: PropTypes.number.isRequired,
  hasPendingPlanChanges: PropTypes.bool.isRequired,
  applyPlans: PropTypes.func.isRequired,
  copyPreviousMonthPlans: PropTypes.func.isRequired,
};

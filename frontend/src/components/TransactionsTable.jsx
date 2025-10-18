import PropTypes from "prop-types";
import { Trash2 } from "lucide-react";
import { formatCurrency } from "../utils/helpers";

export function TransactionsTable({
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  searchText,
  setSearchText,
  flatCategoryList,
  filteredTransactions,
  removeTransaction,
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold">Transactions</h3>
      <div className="mt-3 space-y-2">
        <div className="flex gap-2">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option>All</option>
            {flatCategoryList.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Search notes or category"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
        </div>

        <div className="max-h-56 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amt</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-3 text-gray-400">
                    No transactions yet
                  </td>
                </tr>
              )}
              {filteredTransactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="py-2">{t.date}</td>
                    <td className="py-2">{t.category}</td>
                    <td className="py-2">{formatCurrency(t.amount)}</td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => removeTransaction(t.id)}
                        className="text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

TransactionsTable.propTypes = {
  selectedCategoryFilter: PropTypes.string.isRequired,
  setSelectedCategoryFilter: PropTypes.func.isRequired,
  searchText: PropTypes.string.isRequired,
  setSearchText: PropTypes.func.isRequired,
  flatCategoryList: PropTypes.array.isRequired,
  filteredTransactions: PropTypes.array.isRequired,
  removeTransaction: PropTypes.func.isRequired,
};

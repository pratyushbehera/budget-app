import { useState } from "react";
import { useTransaction } from "../services/transactionApi";
import { formatCurrency } from "../shared/utils/formatCurrency";
import { Pencil, Trash2, Plus } from "lucide-react";
import { AddTransaction } from "../features/transactions/components/AddTransaction";
import { EditTransaction } from "../features/transactions/components/EditTransaction";
import { DeleteTransaction } from "../features/transactions/components/DeleteTransaction";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedMonth } from "../app/store/appSlice";

export function TransactionPage() {
  const dispatch = useDispatch();
  const selectedMonth = useSelector((state) => state.app.selectedMonth);
  const { data, isLoading, error } = useTransaction({ month: selectedMonth });
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTx, setEditTx] = useState(null);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-start md:flex-row flex-col lg:items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Transactions
        </h1>

        <div className="flex gap-2">
          <input
            name="month"
            type="month"
            className="input-field w-48"
            value={selectedMonth}
            onChange={(e) => dispatch(setSelectedMonth(e.target.value))}
          />

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Scrollable Table */}
      <div className="card overflow-x-auto max-w-[92vw] max-h-[65vh] border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="table-head">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Date</th>
              <th className="px-4 py-2 text-left font-medium">Category</th>
              <th className="px-4 py-2 text-left font-medium">Notes</th>
              <th className="px-4 py-2 text-right font-medium">Amount</th>
              <th className="px-4 py-2 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data?.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No transactions found for this month.
                </td>
              </tr>
            )}
            {data?.map((tx) => {
              const isIncome =
                tx.type?.toLowerCase() === "income" ||
                ["salary", "bonus", "interest", "other income"].includes(
                  tx.category.toLowerCase()
                );

              return (
                <tr
                  key={tx._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                    {new Date(tx.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </td>

                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isIncome
                          ? "border border-green-200 text-green-700 dark:border-green-700 dark:text-green-300"
                          : "border border-red-200 text-red-700 dark:border-red-700 dark:text-red-300"
                      }`}
                    >
                      {tx.category}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                    {tx.notes || "-"}
                  </td>

                  <td
                    className={`px-4 py-2 text-right font-medium ${
                      isIncome
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </td>

                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => setEditTx(tx)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(tx)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ➕ Add Modal */}
      {showAddModal && (
        <AddTransaction onClose={() => setShowAddModal(false)} />
      )}

      {/* ✏️ Edit Modal */}
      {editTx && (
        <EditTransaction transaction={editTx} onClose={() => setEditTx(null)} />
      )}

      {/* ⚠️ Delete Confirmation */}
      {deleteTarget && (
        <DeleteTransaction
          transaction={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

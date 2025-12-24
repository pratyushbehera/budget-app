import { useState, useMemo } from "react";
import { useTransaction } from "../services/transactionApi";
import { formatCurrency } from "../shared/utils/formatCurrency";
import { Plus, Wallet, Search, CalendarDays } from "lucide-react";
import { AddTransaction } from "../features/transactions/components/AddTransaction";
import { EditTransaction } from "../features/transactions/components/EditTransaction";
import { DeleteTransaction } from "../features/transactions/components/DeleteTransaction";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedMonth } from "../app/store/appSlice";
import { LoadingPage } from "../shared/components/LoadingPage";
import { TransactionItem } from "../features/transactions/components/TransactionItem";
import { useRecurringRules } from "../services/recurringApi";
import { RecurringDrawer } from "../features/recurring/components/RecurringDrawer";

export function TransactionPage() {
  const dispatch = useDispatch();
  const selectedMonth = useSelector((state) => state.app.selectedMonth);
  const { data, isLoading, error } = useTransaction({ month: selectedMonth });
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTx, setEditTx] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const { data: recurringRules } = useRecurringRules();

  const [isRecurringOpen, setIsRecurringOpen] = useState(false);

  // ✅ Filtered transactions (search + category)
  const filteredTransactions = useMemo(() => {
    if (!data) return [];
    return data.filter((tx) => {
      const matchesSearch =
        tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.notes &&
          tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        categoryFilter === "All" ||
        tx.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [data, searchQuery, categoryFilter]);

  // ✅ Group by date
  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce((acc, tx) => {
      const date = new Date(tx.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(tx);
      return acc;
    }, {});
  }, [filteredTransactions]);

  // 🔥 Summary should be based on filtered results
  const summary = useMemo(() => {
    if (!filteredTransactions) return { total: 0 };

    let total = 0;

    filteredTransactions.forEach((tx) => {
      const isIncome =
        tx.type?.toLowerCase() === "income" ||
        ["salary", "bonus", "interest", "other income", "dividend"].includes(
          tx.category.toLowerCase()
        );

      total += isIncome ? tx.amount : -tx.amount;
    });

    return { total };
  }, [filteredTransactions]);

  // Unique categories for filter dropdown
  const categoryOptions = useMemo(() => {
    const cats = new Set(data?.map((tx) => tx.category) || []);
    return ["All", ...cats];
  }, [data]);

  const shouldShowSummary =
    searchQuery.trim() !== "" || categoryFilter !== "All";

  if (isLoading) return <LoadingPage page="transactions" />;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div>
        {/* Header */}
        <div className="flex gap-4 items-start md:flex-row flex-col lg:items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Transactions
          </h1>

          <div className="flex flex-wrap gap-2">
            {/* Month selector */}
            <input
              name="month"
              type="month"
              className="input-field w-full sm:w-48"
              value={selectedMonth}
              onChange={(e) => dispatch(setSelectedMonth(e.target.value))}
            />

            {/* Buttons container */}
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsRecurringOpen(true)}
                className="btn-secondary flex items-center gap-2 flex-1 sm:flex-none"
              >
                <CalendarDays size={16} /> Recurring
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center gap-2 flex-1 sm:flex-none"
              >
                <Plus size={16} />
                Add Transaction
              </button>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row justify-between gap-3 mb-6">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by category or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field md:w-48"
          >
            {categoryOptions.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {shouldShowSummary && (
          <div className="mb-6">
            <div className="flex items-center justify-between bg-white dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              {/* Left: Icon + Label */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Wallet className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Total for filtered results
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {filteredTransactions.length} transactions
                  </p>
                </div>
              </div>

              {/* Right: Total Amount */}
              <p
                className={`text-sm font-semibold ${
                  summary.total >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {summary.total >= 0 ? "+" : "-"}
                {formatCurrency(Math.abs(summary.total))}
              </p>
            </div>
          </div>
        )}

        {/* Transaction List */}
        {!filteredTransactions?.length ? (
          <div className="flex flex-col items-center justify-center h-60 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Wallet className="w-8 h-8 mb-2" />
            <p className="text-sm">No transactions found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([date, txList]) => (
              <div key={date}>
                <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2 ml-1">
                  {date}
                </h3>

                <ul className="space-y-2">
                  {txList.map((tx) => (
                    <TransactionItem
                      key={tx._id}
                      tx={tx}
                      onEdit={(t) => setEditTx(t)}
                      onDelete={(t) => setDeleteTarget(t)}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <RecurringDrawer
        open={isRecurringOpen}
        onClose={() => setIsRecurringOpen(false)}
        rules={recurringRules || []}
      />

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

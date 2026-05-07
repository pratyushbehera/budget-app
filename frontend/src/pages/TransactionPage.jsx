import { useState, useMemo } from "react";
import { useTransaction } from "../services/transactionApi";
import { formatCurrency } from "../shared/utils/formatCurrency";
import { Plus, Wallet, Search, CalendarDays } from "lucide-react";
import { AddTransaction } from "../features/transactions/components/AddTransaction";
import { EditTransaction } from "../features/transactions/components/EditTransaction";
import { DeleteTransaction } from "../features/transactions/components/DeleteTransaction";
import { useSelector } from "react-redux";
import { LoadingPage } from "../shared/components/LoadingPage";
import { TransactionItem } from "../features/transactions/components/TransactionItem";
import { useRecurringRules } from "../services/recurringApi";
import { RecurringDrawer } from "../features/recurring/components/RecurringDrawer";
import { DateRangePicker } from "../shared/components/DateRangePicker";

export default function TransactionPage() {
  const { selectedMonth, startDate, endDate } = useSelector(
    (state) => state.app,
  );
  const { data, isLoading, error } = useTransaction({
    month: selectedMonth,
    startDate,
    endDate,
  });
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
          tx.category.toLowerCase(),
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
    <div className="min-h-screen max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 sm:space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
              Transactions
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 font-medium tracking-tight mt-1">
              Manage and track your financial flow
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <DateRangePicker />

            <div className="flex gap-3">
              <button
                onClick={() => setIsRecurringOpen(true)}
                className="btn-secondary flex-1 sm:flex-none flex items-center justify-center gap-2 group h-12 px-6 rounded-2xl"
              >
                <CalendarDays
                  size={18}
                  className="group-hover:rotate-12 transition-transform"
                />
                <span className="text-sm font-black uppercase tracking-widest leading-none">
                  Recurring
                </span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex-1 sm:flex-none flex items-center justify-center gap-2 group h-12 px-6 rounded-2xl shadow-xl shadow-primary-500/20 active:scale-95 transition-all"
              >
                <Plus
                  size={22}
                  strokeWidth={3}
                  className="group-hover:rotate-90 transition-transform"
                />
                <span className="text-sm font-black uppercase tracking-widest leading-none">
                  Add New
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters & Summary Row */}
        <div className="flex flex-col gap-8">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12 bg-white dark:bg-gray-950/50 font-semibold"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field md:w-56 bg-white dark:bg-gray-950 font-bold border-r-[16px] border-white-100/20"
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Mini Summary Card */}
          {shouldShowSummary && (
            <div className="bg-primary-500 rounded-3xl p-6 text-white shadow-2xl shadow-primary-500/20 flex items-center justify-between group overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Wallet size={120} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">
                  Filtered Balance
                </p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl font-black tracking-tighter">
                    {summary.total >= 0 ? "+" : "-"}
                    {formatCurrency(Math.abs(summary.total))}
                  </h2>
                </div>
                <p className="text-[11px] font-bold opacity-70 mt-1 uppercase tracking-wider">
                  {filteredTransactions.length} records found
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center relative z-10">
                <Wallet className="w-6 h-6" />
              </div>
            </div>
          )}
        </div>

        {/* Transaction List */}
        {!filteredTransactions?.length ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 bg-gray-50 dark:bg-gray-900/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800 text-center animate-fade-in">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-4xl shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Wallet className="w-12 h-12 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
              No History Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs font-medium">
              We couldn&apos;t find any transactions for the selected period or
              filters.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedTransactions).map(([date, txList]) => (
              <div key={date} className="animate-fade-in">
                <div className="flex items-center gap-4 mb-6 ml-2">
                  <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">
                    {date}
                  </h3>
                  <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {txList.map((tx) => (
                    <TransactionItem
                      key={tx._id}
                      tx={tx}
                      onEdit={(t) => setEditTx(t)}
                      onDelete={(t) => setDeleteTarget(t)}
                    />
                  ))}
                </div>
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

      {/* Modals */}
      {showAddModal && (
        <AddTransaction onClose={() => setShowAddModal(false)} />
      )}

      {editTx && (
        <EditTransaction transaction={editTx} onClose={() => setEditTx(null)} />
      )}

      {deleteTarget && (
        <DeleteTransaction
          transaction={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

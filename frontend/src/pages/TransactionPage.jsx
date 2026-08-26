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
import Button from "@/shared/system/Button";
import Input from "@/shared/system/FormField/Input";
import Select from "@/shared/system/FormField/Select";
import PageHeading from "../shared/components/PageHeading";
import Typography from "@/shared/system/Typography";

export default function TransactionPage() {
  const { selectedMonth, startDate, endDate } = useSelector(
    (state) => state.app
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
    <div className="min-h-screen max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 sm:space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
          {/* Page Header */}
          <PageHeading
            title="Transactions"
            subtitle="Manage and track your financial flow"
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <DateRangePicker />

            <div className="flex gap-3">
              <Button
                onClick={() => setIsRecurringOpen(true)}
                variant="secondary"
                className="uppercase tracking-widest leading-none"
                leftIcon={<CalendarDays size={16} />}
              >
                Recurring
              </Button>

              <Button
                onClick={() => setShowAddModal(true)}
                className="uppercase tracking-widest leading-none"
                leftIcon={<Plus size={16} strokeWidth={2} />}
              >
                Add New
              </Button>
            </div>
          </div>
        </div>

        {/* Filters & Summary Row */}
        <div className="flex flex-col gap-8">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search />}
            />
            <Select
              value={categoryFilter}
              placeholder="Select a category"
              options={categoryOptions.map((cat) => ({
                label: cat,
                value: cat,
              }))}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </div>

          {/* Mini Summary Card */}
          {shouldShowSummary && (
            <div className="bg-primary-500 rounded-3xl p-6 text-white shadow-2xl shadow-primary-500/20 flex items-center justify-between group overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Wallet size={120} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <Typography
                  variant="label"
                  className="uppercase tracking-widest"
                >
                  Filtered Balance
                </Typography>
                <Typography
                  className="tracking-tighter"
                  variant="h3"
                  role="contentinfo"
                >
                  {summary.total >= 0 ? "+" : "-"}
                  {formatCurrency(Math.abs(summary.total))}
                </Typography>

                <Typography
                  variant="caption"
                  className="uppercase tracking-widest"
                >
                  {filteredTransactions.length} records found
                </Typography>
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
            <Typography variant="h4"> No History Found</Typography>
            <Typography variant="subtitle1">
              We couldn&apos;t find any transactions for the selected period or
              filters.
            </Typography>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedTransactions).map(([date, txList]) => (
              <div key={date} className="animate-fade-in">
                <div className="flex items-center gap-4 mb-6 ml-2">
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
                  <Typography
                    variant="overline"
                    className="uppercase tracking-[0.2em]"
                  >
                    {date}
                  </Typography>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
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

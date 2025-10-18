import { useApp } from "../../../app/store";
import { AddTransactionForm } from "../../../features/add-transaction";
import { TransactionsTable } from "../../../components/TransactionsTable";
import { DEFAULT_CATEGORIES } from "../../../utils/constants";
import {
  filterTransactionsByMonth,
  filterTransactions,
} from "../../../shared/lib/calculations";

export function TransactionsPage() {
  const { state, actions } = useApp();
  const {
    transactions,
    currentYear,
    currentMonth,
    selectedCategoryFilter,
    searchText,
  } = state;

  const flatCategoryList = Object.values(DEFAULT_CATEGORIES).flat();

  // Filter transactions by month and year
  const filteredTransactionsByMonth = filterTransactionsByMonth(
    transactions,
    currentYear,
    currentMonth,
  );

  // Apply additional filters
  const filteredTransactions = filterTransactions(
    filteredTransactionsByMonth,
    selectedCategoryFilter,
    searchText,
  );

  const handleRemoveTransaction = (id) => {
    actions.setTransactionToDeleteId(id);
    actions.setDeleteModalOpen(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AddTransactionForm />

      <TransactionsTable
        selectedCategoryFilter={selectedCategoryFilter}
        setSelectedCategoryFilter={actions.setSelectedCategoryFilter}
        searchText={searchText}
        setSearchText={actions.setSearchText}
        flatCategoryList={flatCategoryList}
        filteredTransactions={filteredTransactions}
        removeTransaction={handleRemoveTransaction}
      />
    </div>
  );
}

import { useApp } from "../../../app/store";
import { DEFAULT_CATEGORIES } from "../../../utils/constants";
import { uid } from "../../../utils/helpers";
import { transactionAPI } from "../../../shared/api";
import { offlineStorage } from "../../../shared/lib/offline-storage";
import { Button } from "../../../shared/ui";

export function AddTransactionForm() {
  const { state, actions } = useApp();
  const { form } = state;

  const flatCategoryList = Object.values(DEFAULT_CATEGORIES).flat();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amount = Number(form.amount || 0);
    if (!form.date || !form.category || !amount) {
      alert("Please fill date, category and amount (non-zero)");
      return;
    }

    const transaction = {
      id: uid(),
      date: form.date,
      category: form.category,
      amount: amount,
      notes: form.notes,
    };

    try {
      // Create authenticated fetch function
      const authFetch = async (url, options = {}) => {
        const token = state.userToken;
        const headers = {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        };

        const response = await fetch(url, { ...options, headers });

        if (response.status === 401) {
          actions.logoutUser();
          throw new Error("Unauthorized: Please log in again.");
        }

        return response;
      };

      const newTransaction = await transactionAPI.create(
        authFetch,
        transaction,
      );

      // Update local state
      actions.addTransaction(newTransaction);

      // Save to offline storage
      const updatedTransactions = [...state.transactions, newTransaction];
      offlineStorage.saveTransactions(updatedTransactions);

      // Reset form
      const initialForm = {
        date: new Date().toISOString().slice(0, 10),
        category: flatCategoryList[0] || "",
        amount: "",
        notes: "",
      };
      actions.resetForm(initialForm);

      // Try to sync offline actions if online
      if (navigator.onLine) {
        // Sync logic would go here
      } else {
        // Store action for offline sync
        offlineStorage.saveOfflineAction({
          type: "addTransaction",
          payload: transaction,
        });
      }
    } catch (error) {
      console.error("Error adding transaction:", error);

      // Store offline and update UI optimistically
      offlineStorage.saveOfflineAction({
        type: "addTransaction",
        payload: transaction,
      });
      actions.addTransaction(transaction);

      const initialForm = {
        date: new Date().toISOString().slice(0, 10),
        category: flatCategoryList[0] || "",
        amount: "",
        notes: "",
      };
      actions.resetForm(initialForm);

      console.log("Transaction saved offline.");
    }
  };

  const handleInputChange = (field, value) => {
    actions.setForm({ [field]: value });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Add Transaction
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            value={form.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a category</option>
            {flatCategoryList.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount
          </label>
          <input
            type="number"
            id="amount"
            step="0.01"
            value={form.amount}
            onChange={(e) => handleInputChange("amount", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={form.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Add any additional notes..."
          />
        </div>

        <Button type="submit" className="w-full">
          Add Transaction
        </Button>
      </form>
    </div>
  );
}

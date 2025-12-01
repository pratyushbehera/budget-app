import { useEffect, useState } from "react";
import { useNotification } from "../../../contexts/NotificationContext";
import { useEditTransaction } from "../../../services/transactionApi";
import { Modal } from "../../../shared/components/Modal";
import { useSelector } from "react-redux";

export const EditTransaction = ({ transaction, onClose }) => {
  const { category: categoryList, loading: isLoading } = useSelector(
    (state) => state.category
  );
  const { mutateAsync: editTx, isPending } = useEditTransaction();

  const { addNotification } = useNotification();

  const [form, setForm] = useState();
  useEffect(() => {
    let categoryId;
    if (!transaction.categoryId && categoryList) {
      categoryId = categoryList?.find(
        (ct) => ct.name === transaction.category
      )?._id;
    } else {
      categoryId = transaction?.categoryId;
    }
    setForm({ ...transaction, categoryId });
  }, [transaction, categoryList]);

  const setFormValue = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const transactionData = { ...form };
      if (
        !transactionData.amount ||
        !transactionData.category ||
        !transactionData.notes
      ) {
        addNotification({
          type: "error",
          title: "Validation error",
          message: "Please fill category, amount, notes.",
        });
        return;
      }

      const updates = {
        date: form.date,
        category: categoryList?.find((ct) => ct._id === form.categoryId)?.name,
        categoryId: form.categoryId,
        amount: form.amount,
        notes: form.notes,
      };

      await editTx(
        { id: form.id, updates },
        {
          onSuccess: () => {
            addNotification({
              type: "success",
              title: "Success",
              message: "Transaction updated successfully.",
            });
            onClose();
          },
          onError: (err) => {
            addNotification({
              type: "error",
              title: "Failure",
              message: err?.message || "Error updating transaction.",
            });
          },
        }
      );
    } catch (err) {
      addNotification({
        type: "error",
        title: "Failure",
        message: err.message || "Failed to update transaction.",
      });
      onClose();
    }
  };

  if (isLoading) return "Loading...";
  return (
    <Modal title="Edit Transaction" onClose={onClose}>
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Section heading */}
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Transaction Details
        </h3>
        <div className="space-y-1.5">
          <label
            htmlFor="transaction-date"
            className="text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            Date
          </label>
          <input
            id="transaction-date"
            name="date"
            type="date"
            value={form?.date}
            onChange={setFormValue}
            placeholder="Date"
            className="input-field focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="categoryId"
            className="text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={form?.categoryId}
            onChange={setFormValue}
            className="input-field  focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select category</option>
            {categoryList?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="amount"
            className="text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            Amount
          </label>
          <input
            id="amount"
            type="number"
            name="amount"
            value={form?.amount}
            onChange={setFormValue}
            placeholder="Amount"
            className="input-field  focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="notes"
            className="text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            Notes
          </label>
          <textarea
            id="notes"
            placeholder="Notes"
            name="notes"
            value={form?.notes}
            onChange={setFormValue}
            className="input-field  focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex justify-end  border-t dark:border-gray-800 mt-6 gap-3 pt-4">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? "Saving..." : "Update"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

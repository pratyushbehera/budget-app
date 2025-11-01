import { useEffect, useState } from "react";
import { useNotification } from "../../../contexts/NotificationContext";
import { useCategory } from "../../../services/categoryApi";
import { useEditTransaction } from "../../../services/transactionApi";
import { Modal } from "../../../shared/components/Modal";

export const EditTransaction = ({ transaction, onClose }) => {
  const { data: categoryList, isLoading, error } = useCategory();
  const { mutateAsync: editTx, isPending } = useEditTransaction();

  const { addNotification } = useNotification();

  const [form, setForm] = useState();

  useEffect(() => {
    let categoryId;
    if (!transaction.categoryId && categoryList) {
      categoryId = categoryList?.find(
        (ct) => ct.name === transaction.category
      )?._id;
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
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          id="transaction-date"
          name="date"
          type="date"
          value={form?.date}
          onChange={setFormValue}
          placeholder="Date"
          className="w-full border p-2 rounded-md dark:text-gray-800 dark:bg-gray-50 dark:border-gray-700"
        />
        <select
          name="categoryId"
          value={form?.categoryId}
          onChange={setFormValue}
          className="w-full border p-2 rounded-md dark:text-gray-800 dark:bg-gray-50 dark:border-gray-700"
        >
          <option value="">Select category</option>
          {categoryList?.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="amount"
          value={form?.amount}
          onChange={setFormValue}
          placeholder="Amount"
          className="w-full border p-2 rounded-md dark:text-gray-800 dark:bg-gray-50 dark:border-gray-700"
        />
        <textarea
          placeholder="Notes"
          name="notes"
          value={form.notes}
          onChange={setFormValue}
          className="w-full border p-2 rounded-md dark:text-gray-800 dark:bg-gray-50 dark:border-gray-700"
        />
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm dark:text-gray-600 dark:hover:text-gray-400 rounded-md border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </form>
    </Modal>
  );
};

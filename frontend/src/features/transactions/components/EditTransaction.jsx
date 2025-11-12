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
          className="input-field"
        />
        <select
          name="categoryId"
          value={form?.categoryId}
          onChange={setFormValue}
          className="input-field"
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
          className="input-field"
        />
        <textarea
          placeholder="Notes"
          name="notes"
          value={form?.notes}
          onChange={setFormValue}
          className="input-field"
        />
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            Update
          </button>
        </div>
      </form>
    </Modal>
  );
};

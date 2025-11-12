import { useEffect, useState } from "react";
import { useAddTransaction } from "../../../services/transactionApi";
import { Modal } from "../../../shared/components/Modal";
import { useNotification } from "../../../contexts/NotificationContext";
import { uid } from "../../../shared/utils/generateUid";
import { useSelector } from "react-redux";

export const AddTransaction = ({ onClose }) => {
  const {
    category: categoryList,
    loading: isLoading,
    error,
  } = useSelector((state) => state.category);
  const { mutateAsync: addTx, isPending } = useAddTransaction();

  const { addNotification } = useNotification();

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    categoryId: "",
    amount: "0",
    notes: "",
  });

  const setFormValue = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const transactionData = { ...form };
      if (
        !transactionData.amount ||
        !transactionData.categoryId ||
        !transactionData.notes
      ) {
        addNotification({
          type: "error",
          title: "Validation error",
          message: "Please fill category, amount, notes.",
        });
        return;
      }

      const transaction = {
        id: uid(),
        date: form.date,
        category: categoryList?.find((ct) => ct._id === form.categoryId)?.name,
        categoryId: form.categoryId,
        amount: form.amount,
        notes: form.notes,
      };

      await addTx(
        { transaction },
        {
          onSuccess: () => {
            addNotification({
              type: "success",
              title: "Success",
              message: "Transaction added successfully.",
            });
            onClose();
          },
          onError: (err) => {
            addNotification({
              type: "error",
              title: "Failure",
              message: err?.message || "Error adding transaction.",
            });
          },
        }
      );
    } catch (err) {
      addNotification({
        type: "error",
        title: "Failure",
        message: err.message || "Failed to add transaction.",
      });
      onClose();
    }
  };

  useEffect(() => {
    if (error) {
      addNotification({
        type: "error",
        title: "Something went wrong",
        message: "Please try again after sometime.",
      });
      onClose();
    }
  }, [error]);

  return (
    <Modal title="Add Transaction" onClose={onClose}>
      {isLoading ? (
        "Loading..."
      ) : (
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            id="transaction-date"
            name="date"
            type="date"
            value={form.date}
            onChange={setFormValue}
            placeholder="Date"
            className="input-field"
          />
          <select
            name="categoryId"
            value={form.categoryId}
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
            value={form.amount}
            onChange={setFormValue}
            placeholder="Amount"
            className="input-field"
          />
          <textarea
            placeholder="Notes"
            name="notes"
            value={form.notes}
            onChange={setFormValue}
            className="input-field"
          />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="btn-primary">
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

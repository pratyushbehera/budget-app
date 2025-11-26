import { useState } from "react";
import { Modal } from "../../../shared/components/Modal";
import { useNotification } from "../../../contexts/NotificationContext";
import { useAddCategory } from "../../../services/categoryApi";

export const AddCategory = ({ onClose }) => {
  const { addNotification } = useNotification();
  const { mutateAsync: addCategory, isPending } = useAddCategory();

  const [form, setForm] = useState({
    name: "",
    type: "Expense",
    group: "",
  });

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.group) {
      addNotification({
        type: "error",
        title: "Validation Error",
        message: "Please fill category name and group.",
      });
      return;
    }

    try {
      await addCategory(
        { category: form },
        {
          onSuccess: () => {
            addNotification({
              type: "success",
              title: "Success",
              message: "Category added successfully.",
            });
            onClose();
          },
          onError: (err) => {
            addNotification({
              type: "error",
              title: "Failure",
              message: err?.message || "Error adding category.",
            });
          },
        }
      );
    } catch (err) {
      addNotification({
        type: "error",
        title: "Failure",
        message: err.message || "Error saving category.",
      });
    }
  };

  return (
    <Modal title="Add New Category" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Category Name (e.g., Groceries)"
          value={form.name}
          onChange={handleChange}
          className="input-field"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="input-field"
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <select
          name="group"
          value={form.group}
          onChange={handleChange}
          className="input-field"
        >
          <option value="Fixed Needs">Fixed Needs</option>
          <option value="Savings & Investments">Savings & Investments</option>
          <option value="Annual/Irregular">Annual/Irregular</option>
          <option value="Variable Wants">Variable Wants</option>
          <option value="Income">Income</option>
        </select>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isPending} className="btn-primary">
            {isPending ? "Saving..." : "Add Category"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

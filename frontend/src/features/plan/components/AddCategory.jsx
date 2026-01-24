import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Modal } from "../../../shared/components/Modal";
import { useToast } from "../../../contexts/ToastContext";
import { useAddCategory } from "../../../services/categoryApi";
import { FormInput } from "../../../shared/components/FormInput";

const categorySchema = yup.object().shape({
  name: yup.string().required("Category Name is required"),
  type: yup.string().required("Type is required"),
  group: yup.string().required("Group is required"),
});

export const AddCategory = ({ onClose }) => {
  const { addToast } = useToast();
  const { mutateAsync: addCategory, isPending } = useAddCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: "",
      type: "Expense",
      group: "Fixed Needs",
    },
  });

  const onSubmit = async (data) => {
    try {
      await addCategory(
        { category: data },
        {
          onSuccess: () => {
            addToast({
              type: "success",
              title: "Success",
              message: "Category added successfully.",
            });
            onClose();
          },
          onError: (err) => {
            addToast({
              type: "error",
              title: "Failure",
              message: err?.message || "Error adding category.",
            });
          },
        }
      );
    } catch (err) {
      addToast({
        type: "error",
        title: "Failure",
        message: err.message || "Error saving category.",
      });
    }
  };

  return (
    <Modal title="Add New Category" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          placeholder="Category Name (e.g., Groceries)"
          error={errors.name}
          {...register("name")}
        />

        <div className="space-y-2">
          <select
            className="input-field"
            {...register("type")}
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        <div className="space-y-2">
          <select
            className="input-field"
            {...register("group")}
          >
            <option value="Fixed Needs">Fixed Needs</option>
            <option value="Savings & Investments">Savings & Investments</option>
            <option value="Annual/Irregular">Annual/Irregular</option>
            <option value="Variable Wants">Variable Wants</option>
            <option value="Income">Income</option>
          </select>
        </div>

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

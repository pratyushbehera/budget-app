import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "../../../contexts/ToastContext";
import { useAddCategory } from "../../../services/categoryApi";

import Button from "@/shared/system/Button";
import Modal from "@/shared/system/Modal";
import Input from "@/shared/system/FormField/Input";
import Select from "@/shared/system/FormField/Select";

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
    <Modal onClose={onClose}>
      <Modal.Header>Add New Category</Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Input
            label="Category Name"
            required
            placeholder="Category Name (e.g., Groceries)"
            error={errors?.name?.message}
            {...register("name")}
          />

          <div className="mt-8">
            <Select
              label="Type"
              required
              placeholder="Choose a type"
              options={[
                { label: "Income", value: "Income" },
                { label: "Expense", value: "Expense" },
              ]}
              {...register("type")}
            />
          </div>

          <div className="mt-8">
            <Select
              label="Group"
              required
              placeholder="Choose a group"
              options={[
                { label: "Fixed Needs", value: "Fixed Needs" },
                {
                  label: "Savings & Investments",
                  value: "Savings & Investments",
                },
                { label: "Annual/Irregular", value: "Annual/Irregular" },
                { label: "Variable Wants", value: "Variable Wants" },
                { label: "Income", value: "Income" },
              ]}
              {...register("group")}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" type="submit" isLoading={isPending}>
            {isPending ? "Saving..." : "Add Category"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

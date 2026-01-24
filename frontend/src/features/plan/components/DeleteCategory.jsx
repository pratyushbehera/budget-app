import { useToast } from "../../../contexts/ToastContext";
import { useDeleteCategory } from "../../../services/categoryApi";
import { Modal } from "../../../shared/components/Modal";

export const DeleteCategory = ({ category, onClose }) => {
  console.log(category);
  const { mutateAsync: deleteCat, isPending } = useDeleteCategory();

  const { addToast } = useToast();
  const handleDelete = async () => {
    try {
      deleteCat(category._id, {
        onSuccess: () => {
          addToast({
            type: "success",
            title: "Success",
            message: "Category deleted successfully.",
          });
          onClose();
        },
        onError: (err) => {
          addToast({
            type: "error",
            title: "Failure",
            message: err?.message || "Error deleting category.",
          });
        },
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Failure",
        message: err.message || "Failed to delete category.",
      });
      onClose();
    }
  };

  return (
    <Modal title="Delete Category" onClose={onClose}>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
        Are you sure you want to delete this category - {category.name}?
      </p>
      <div className="flex justify-end gap-3">
        <button className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn-primary"
          onClick={handleDelete}
          disabled={isPending}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

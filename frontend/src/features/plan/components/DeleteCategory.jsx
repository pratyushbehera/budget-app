import { useToast } from "../../../contexts/ToastContext";
import { useDeleteCategory } from "../../../services/categoryApi";

import Button from "@/shared/system/Button";
import Modal from "@/shared/system/Modal";

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
    <Modal onClose={onClose}>
      <Modal.Header>Delete Category</Modal.Header>
      <Modal.Body>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
          Are you sure you want to delete this category - {category.name}?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button size="sm" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          variant="tertiary"
          onClick={handleDelete}
          isLoading={isPending}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

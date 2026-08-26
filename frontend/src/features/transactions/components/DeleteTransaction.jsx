import { useToast } from "../../../contexts/ToastContext";
import { useDeleteTransaction } from "../../../services/transactionApi";
import Button from "@/shared/system/Button";
import Modal from "@/shared/system/Modal";

export const DeleteTransaction = ({ transaction, onClose }) => {
  const { mutateAsync: deleteTx, isPending } = useDeleteTransaction();

  const { addToast } = useToast();
  const handleDelete = async () => {
    try {
      deleteTx(transaction.id, {
        onSuccess: () => {
          addToast({
            type: "success",
            title: "Success",
            message: "Transaction deleted successfully.",
          });
          onClose();
        },
        onError: (err) => {
          addToast({
            type: "error",
            title: "Failure",
            message: err?.message || "Error deleting transaction.",
          });
        },
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Failure",
        message: err.message || "Failed to delete transaction.",
      });
      onClose();
    }
  };

  return (
    <Modal onClose={onClose}>
      <Modal.Header>Delete Transaction</Modal.Header>
      <Modal.Body>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
          Are you sure you want to delete this transaction?
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

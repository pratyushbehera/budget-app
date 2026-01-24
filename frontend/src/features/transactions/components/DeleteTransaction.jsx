import { useToast } from "../../../contexts/ToastContext";
import { useDeleteTransaction } from "../../../services/transactionApi";
import { Modal } from "../../../shared/components/Modal";

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
    <Modal title="Delete Transaction" onClose={onClose}>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
        Are you sure you want to delete this transaction?
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

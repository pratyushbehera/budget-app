import { useNotification } from "../../../contexts/NotificationContext";
import { useDeleteTransaction } from "../../../services/transactionApi";
import { Modal } from "../../../shared/components/Modal";

export const DeleteTransaction = ({ transaction, onClose }) => {
  const { mutateAsync: deleteTx, isPending } = useDeleteTransaction();

  const { addNotification } = useNotification();
  const handleDelete = async () => {
    try {
      deleteTx(transaction.id, {
        onSuccess: () => {
          addNotification({
            type: "success",
            title: "Success",
            message: "Transaction deleted successfully.",
          });
          onClose();
        },
        onError: (err) => {
          addNotification({
            type: "error",
            title: "Failure",
            message: err?.message || "Error deleting transaction.",
          });
        },
      });
    } catch (err) {
      addNotification({
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
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm dark:text-gray-600 dark:hover:text-gray-400 rounded-md border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

import { Modal } from "../../../shared/components/Modal";
import { useDeleteRecurringRule } from "../../../services/recurringApi";
import { useNotification } from "../../../contexts/NotificationContext";

export const DeleteRecurringModal = ({ rule, onClose }) => {
  const { mutateAsync: deleteRule, isPending } = useDeleteRecurringRule();
  const { addNotification } = useNotification();

  const handleDelete = async () => {
    try {
      await deleteRule(rule._id);
      addNotification({
        type: "success",
        title: "Recurring removed",
        message: `${rule.title} has been deleted.`,
      });
      onClose();
    } catch (err) {
      addNotification({
        type: "error",
        title: "Delete failed",
        message:
          err?.response?.data?.message ||
          err.message ||
          "Failed to delete recurring rule",
      });
    }
  };

  return (
    <Modal title="Delete Recurring Rule" onClose={onClose}>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
        This will permanently remove this recurring rule.
        <br />
        <strong>This action cannot be undone.</strong>
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

import { useDeleteRecurringRule } from "../../../services/recurringApi";
import { useToast } from "../../../contexts/ToastContext";
import Button from "@/shared/system/Button";
import Modal from "@/shared/system/Modal";

export const DeleteRecurringModal = ({ rule, onClose }) => {
  const { mutateAsync: deleteRule, isPending } = useDeleteRecurringRule();
  const { addToast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteRule(rule._id);
      addToast({
        type: "success",
        title: "Recurring removed",
        message: `${rule.title} has been deleted.`,
      });
      onClose();
    } catch (err) {
      addToast({
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
    <Modal onClose={onClose}>
      <Modal.Header>Delete Recurring Rule</Modal.Header>
      <Modal.Body>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
          This will permanently remove this recurring rule.
          <br />
          <strong>This action cannot be undone.</strong>
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

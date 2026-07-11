import { useStopRecurringRule } from "../../../services/recurringApi";
import { useToast } from "../../../contexts/ToastContext";
import Button from "@/shared/system/Button";
import Modal from "@/shared/system/Modal";

export const StopRecurringModal = ({ rule, onClose }) => {
  const { mutateAsync: stopRule, isPending } = useStopRecurringRule();
  const { addToast } = useToast();

  const handleStop = async () => {
    try {
      await stopRule(rule._id);
      addToast({
        type: "warning",
        title: "Recurring stopped",
        message: `${rule.title} will no longer repeat.`,
      });
      onClose();
    } catch (err) {
      addToast({
        type: "error",
        title: "Action failed",
        message:
          err?.response?.data?.message ||
          err.message ||
          "Failed to stop recurring",
      });
    }
  };

  return (
    <Modal onClose={onClose}>
      <Modal.Header>Stop Recurring</Modal.Header>
      <Modal.Body>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
          This will stop future recurring transactions.
          <br />
          Past transactions will not be affected.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button size="sm" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleStop} isLoading={isPending}>
          Stop
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

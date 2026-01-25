import { Modal } from "../../../shared/components/Modal";
import { useStopRecurringRule } from "../../../services/recurringApi";
import { useToast } from "../../../contexts/ToastContext";

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
    <Modal title="Stop Recurring" onClose={onClose}>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
        This will stop future recurring transactions.
        <br />
        Past transactions will not be affected.
      </p>

      <div className="flex justify-end gap-3">
        <button className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn-primary"
          onClick={handleStop}
          disabled={isPending}
        >
          Stop
        </button>
      </div>
    </Modal>
  );
};

import { useStopRecurringRule } from "../../../services/recurringApi";
import { useNotification } from "../../../contexts/NotificationContext";

export function RecurringRuleList({ rules = [] }) {
  const stopMutation = useStopRecurringRule();
  const { addNotification } = useNotification();

  const handleStop = (rule) => {
    if (
      !window.confirm(
        "This will stop future recurring transactions. Past transactions will not be affected.\n\nContinue?"
      )
    ) {
      return;
    }

    stopMutation.mutate(rule._id, {
      onSuccess: () => {
        addNotification({
          type: "warning",
          title: "Recurring stopped",
          message: `${rule.title} will no longer repeat.`,
        });
      },
      onError: (err) => {
        addNotification({
          type: "error",
          title: "Action failed",
          message:
            err?.response?.data?.message ||
            err.message ||
            "Something went wrong",
        });
      },
    });
  };

  if (!rules.length) {
    return (
      <div className="card p-6 text-center text-gray-500">
        No recurring transactions set up yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rules.map((r) => (
        <div
          key={r._id}
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {r.title}
            </p>
            <p className="text-xs text-gray-500">
              {r.frequency} · ₹{r.amount}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                r.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {r.isActive ? "Active" : "Stopped"}
            </span>

            {r.isActive && (
              <button
                onClick={() => handleStop(r)}
                className="btn-secondary text-xs"
                disabled={stopMutation.isPending}
              >
                Stop
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

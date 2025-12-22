import { useEnableRecurringRule } from "../../../services/recurringApi";
import { useNotification } from "../../../contexts/NotificationContext";
import { useState } from "react";
import { StopRecurringModal } from "./StopRecurringModal";
import { DeleteRecurringModal } from "./DeleteRecurringModal";

export function RecurringRuleList({ rules = [] }) {
  const [stopTarget, setStopTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const enableMutation = useEnableRecurringRule();
  const { addNotification } = useNotification();

  const handleEnable = (rule) => {
    enableMutation.mutate(rule._id, {
      onSuccess: () =>
        addNotification({
          type: "success",
          title: "Recurring enabled",
          message: `${rule.title} will start again.`,
        }),
      onError: (err) =>
        addNotification({
          type: "error",
          title: "Action failed",
          message:
            err?.response?.data?.message ||
            err.message ||
            "Something went wrong",
        }),
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

          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                r.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {r.isActive ? "Active" : "Stopped"}
            </span>

            {/* ACTIVE */}
            {r.isActive && (
              <button
                onClick={() => setStopTarget(r)}
                className="btn-secondary text-xs"
              >
                Stop
              </button>
            )}

            {/* INACTIVE */}
            {!r.isActive && (
              <>
                <button
                  onClick={() => handleEnable(r)}
                  className="btn-primary text-xs"
                  disabled={enableMutation.isPending}
                >
                  Enable
                </button>

                <button
                  onClick={() => setDeleteTarget(r)}
                  className="btn-primary bg-red-500 text-xs"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {stopTarget && (
        <StopRecurringModal
          rule={stopTarget}
          onClose={() => setStopTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteRecurringModal
          rule={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

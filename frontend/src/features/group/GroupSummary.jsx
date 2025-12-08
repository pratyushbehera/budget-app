import React from "react";
import { useGroupSummary, useSettleUp } from "../../services/groupApi";
import { ArrowRight, Wallet } from "lucide-react";
import { useSelector } from "react-redux";
import { uid } from "../../shared/utils/generateUid";
import { useNotification } from "../../contexts/NotificationContext";

const GroupSummary = ({ group, groupId }) => {
  const { addNotification } = useNotification();
  const { user } = useSelector((state) => state.auth);
  const { data: summary, isLoading } = useGroupSummary(groupId);
  const { mutate: settleUp, isPending } = useSettleUp(groupId);

  const getMemberName = (userId) => {
    const m = group.members.find((x) => x.userId?._id === userId);
    return m?.userId?.firstName || m?.email || "Unknown";
  };

  if (isLoading) return <div>Loading summary...</div>;

  if (!summary?.settlements?.length)
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border dark:border-gray-800 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          No one owes anything 🎉
        </p>
      </div>
    );

  const handleSettle = (from, to, amount) => {
    settleUp(
      { settlements: { id: uid(), from, to, amount } },
      {
        onError: (err) => {
          addNotification({
            type: "error",
            title: "Failure",
            message: err?.message || "Error deleting member.",
          });
        },
        onSuccess: () => {
          addNotification({
            type: "success",
            title: "Success",
            message: "Transactions settled.",
          });
        },
      }
    );
  };
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border dark:border-gray-800">
      <h2 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Summary
      </h2>

      <div className="space-y-3">
        {summary?.settlements.map((s, idx) => {
          const isYouOwe = s.from.id === user._id;
          const isYouGet = s.to.id === user._id;

          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                <Wallet
                  className="text-primary-600 dark:text-primary-400"
                  size={18}
                />

                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">
                    {isYouOwe ? "You" : getMemberName(s.from.id)}
                    <ArrowRight className="inline mx-1" size={14} />
                    {isYouGet ? "You" : getMemberName(s.to.id)}
                  </p>

                  <p className="text-sm text-gray-500">₹{s.amount}</p>
                </div>
              </div>

              {(isYouOwe || isYouGet) && (
                <button
                  onClick={() => handleSettle(s.from.id, s.to.id, s.amount)}
                  disabled={isPending}
                  className="px-3 py-1 rounded bg-primary-600 text-white hover:bg-primary-700 text-sm"
                >
                  {isPending ? "Processing..." : "Settle Up"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupSummary;

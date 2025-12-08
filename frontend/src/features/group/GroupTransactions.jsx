import React from "react";
import { useSelector } from "react-redux";
import { useGroupTransactions } from "../../services/groupApi";
import { Wallet, ArrowRight } from "lucide-react";

const GroupTransactions = ({ group, groupId }) => {
  const { data: transactions, isLoading } = useGroupTransactions(groupId);
  const currentUser = useSelector((s) => s.auth.user);

  const getMemberName = (userId) => {
    const m = group.members.find((x) => x.userId?._id === userId);
    return m?.userId?.firstName || m?.email || "Unknown";
  };

  const getSplitType = (tx) => {
    if (!tx.splitDetails?.length) return null;

    const amounts = tx.splitDetails.map((s) => Number(s.shareAmount));
    const uniqueAmounts = new Set(amounts);

    if (uniqueAmounts.size === 1) return "Equal Split";

    const total = amounts.reduce((a, b) => a + b, 0);
    const percents = amounts.map((amt) => (amt / total) * 100);
    const sumPercent = percents.reduce((x, y) => x + y, 0);

    if (Math.abs(sumPercent - 100) < 1) return "% Split";

    return "Custom Split";
  };

  const getUserIndicator = (tx) => {
    if (tx.paidBy === currentUser._id) return "You paid";
    const share = tx.splitDetails.find((s) => s.userId === currentUser._id);
    if (share) return "You owe";
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border dark:border-gray-800">
      <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Group Transactions
      </h2>

      {isLoading ? (
        <div className="text-gray-500">Loading transactions...</div>
      ) : !transactions?.length ? (
        <div className="text-gray-500">No transactions yet</div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => {
            const payerName = getMemberName(tx.paidBy);
            const splitType = getSplitType(tx);
            const indicator = getUserIndicator(tx);

            return (
              <div
                key={tx._id}
                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-start justify-between hover:shadow transition"
              >
                {/* Left content */}
                <div className="flex gap-3">
                  <Wallet
                    className="text-primary-600 dark:text-primary-400 mt-1"
                    size={22}
                  />

                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {payerName} paid ₹{tx.amount}
                    </p>

                    {tx.notes && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {tx.notes}
                      </p>
                    )}

                    <div className="flex gap-2 mt-1">
                      {splitType && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                          {splitType}
                        </span>
                      )}

                      {indicator && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            indicator === "You paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {indicator}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(tx.date).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GroupTransactions;

import React from "react";
import { useSelector } from "react-redux";
import { Wallet } from "lucide-react";
import { useGroupTransactions } from "../../../services/groupApi";

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
    <div className="row-span-2 bg-white dark:bg-gray-950 rounded-2xl shadow p-6 border dark:border-gray-800">
      <h2 className="font-semibold text-md text-gray-800 dark:text-white mb-5">
        Transactions
      </h2>

      {isLoading ? (
        <div className="text-gray-500 dark:text-gray-400 italic">
          Fetching transactions...
        </div>
      ) : !transactions?.length ? (
        <div className="text-gray-500 dark:text-gray-400">
          No transactions yet
        </div>
      ) : (
        <div className="space-y-4 max-h-[65vh] overflow-scroll">
          {transactions.map((tx) => {
            const payerName = getMemberName(tx.paidBy);
            const splitType = getSplitType(tx);
            const indicator = getUserIndicator(tx);

            return (
              <div
                key={tx._id}
                className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/60
                           flex justify-between items-start hover:shadow-md
                           transition-shadow cursor-pointer"
              >
                {/* LEFT SECTION */}
                <div className="flex gap-4">
                  {/* Icon tile */}
                  <div
                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 
                                  flex items-center justify-center shadow-sm mt-1"
                  >
                    <Wallet size={20} className="text-white" />
                  </div>

                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {payerName} paid{" "}
                      <span className="font-bold text-gray-900 dark:text-white">
                        ₹{tx.amount}
                      </span>
                    </p>

                    {tx.notes && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {tx.notes}
                      </p>
                    )}

                    {/* Badges */}
                    <div className="flex gap-2 mt-2">
                      {splitType && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
                          {splitType}
                        </span>
                      )}

                      {indicator && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md 
                            ${
                              indicator === "You paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                          `}
                        >
                          {indicator}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT SECTION (Date) */}
                <div className="flex flex-col items-end">
                  <span
                    className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 
                                   dark:text-gray-300 px-2 py-1 rounded-md"
                  >
                    {new Date(tx.date).toLocaleDateString()}
                  </span>
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

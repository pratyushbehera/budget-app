import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Wallet } from "lucide-react";
import { useGroupTransactions } from "../../../services/groupApi";

const GroupTransactions = ({ group, groupId }) => {
  const [expandedTxId, setExpandedTxId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedTxId((prev) => (prev === id ? null : id));
  };

  const { data: transactions, isLoading } = useGroupTransactions(groupId);
  const currentUser = useSelector((s) => s.auth.user);

  const getMemberName = (userId) => {
    const m = group.members.find((x) => x.userId?._id === userId);
    return m?.userId?.firstName || m?.email || "Unknown";
  };

  const getEffectiveSplitInfo = (tx, currentUserId) => {
    if (!tx.splitDetails?.length) return null;

    const total = tx.splitDetails.reduce(
      (s, d) => s + Number(d.shareAmount),
      0
    );

    const nonZeroShares = tx.splitDetails.filter(
      (s) => Number(s.shareAmount) > 0
    );

    // ✅ Only one person pays 100%
    if (nonZeroShares.length === 1) {
      return {
        type: "personal",
        ownerId: nonZeroShares[0].userId,
      };
    }

    return { type: "shared" };
  };

  const getSplitType = (tx) => {
    const info = getEffectiveSplitInfo(tx);

    if (info?.type === "personal") return "Personal";

    return "Shared";
  };

  const getUserIndicator = (tx) => {
    const splitInfo = getEffectiveSplitInfo(tx, currentUser._id);

    if (splitInfo?.type === "personal") {
      if (tx.paidBy === currentUser._id) return "You paid";
      return null; // 👈 important
    }

    if (tx.paidBy === currentUser._id) return "You paid";

    const share = tx.splitDetails.find((s) => s.userId === currentUser._id);

    if (share && Number(share.shareAmount) > 0) return "You owe";

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
                onClick={() => toggleExpand(tx._id)}
                className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/60
             hover:shadow-md
             transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start">
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
                {expandedTxId === tx._id && tx.splitDetails?.length > 0 && (
                  <div className="mt-4 border-t pt-3 text-sm text-gray-700 dark:text-gray-300">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Split breakdown
                    </p>

                    <div className="space-y-1">
                      {tx.splitDetails.map((s) => {
                        const name = getMemberName(s.userId);
                        const percent = (
                          (Number(s.shareAmount) / tx.amount) *
                          100
                        ).toFixed(0);

                        return (
                          <div
                            key={s.userId}
                            className="flex justify-between items-center"
                          >
                            <span>
                              {name}
                              {s.userId === currentUser._id && (
                                <span className="text-xs text-gray-400 ml-1">
                                  (You)
                                </span>
                              )}
                            </span>

                            <span className="font-medium">
                              ₹{Number(s.shareAmount).toFixed(2)}
                              <span className="text-xs text-gray-400 ml-1">
                                ({percent}%)
                              </span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GroupTransactions;

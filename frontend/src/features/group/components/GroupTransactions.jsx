import { useState } from "react";
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

  const getEffectiveSplitInfo = (tx) => {
    if (!tx.splitDetails?.length) return null;

    const nonZeroShares = tx.splitDetails.filter(
      (s) => Number(s.shareAmount) > 0,
    );

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
      return null;
    }
    if (tx.paidBy === currentUser._id) return "You paid";
    const share = tx.splitDetails.find((s) => s.userId === currentUser._id);
    if (share && Number(share.shareAmount) > 0) return "You owe";
    return null;
  };

  return (
    <div className="row-span-2 bg-white dark:bg-gray-950/40 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 animate-fade-in flex flex-col h-full">
      <div className="flex items-center p-8 gap-4">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
          Recent Activity
        </h2>
        <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          History
        </span>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-500 rounded-2xl animate-spin"></div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Loading history...
          </p>
        </div>
      ) : !transactions?.length ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-4">
            <Wallet size={40} className="text-gray-300" />
          </div>
          <p className="text-lg font-black text-gray-400 tracking-tight">
            No group transactions yet
          </p>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">
            Start a expense to see it here
          </p>
        </div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[85vh]">
          {transactions.map((tx) => {
            const payerName = getMemberName(tx.paidBy);
            const splitType = getSplitType(tx);
            const indicator = getUserIndicator(tx);
            const isExpanded = expandedTxId === tx._id;

            return (
              <div
                key={tx._id}
                onClick={() => toggleExpand(tx._id)}
                className={`group p-5 rounded-[2rem] transition-all duration-300 cursor-pointer border lg:mx-8
                  ${
              isExpanded
                ? "bg-white dark:bg-gray-800 shadow-2xl shadow-gray-200 border-gray-100 dark:border-gray-700"
                : "bg-gray-50 dark:bg-gray-950/60 border-transparent hover:bg-white dark:hover:bg-gray-950/80 hover:shadow-xl hover:shadow-gray-100 dark:hover:shadow-none hover:border-gray-100 dark:hover:border-gray-700"
              }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 transition-transform group-hover:scale-110 group-hover:rotate-3 mt-1">
                      <Wallet
                        size={28}
                        className="text-white"
                        strokeWidth={2.5}
                      />
                    </div>

                    <div className="space-y-1 w-[160px] lg:w-max">
                      <p className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                        {payerName} paid{" "}
                        <span className="text-primary-500">₹{tx.amount}</span>
                      </p>

                      {tx.notes && (
                        <p className="text-sm font-bold text-gray-400 dark:text-gray-500 tracking-tight">
                          {tx.notes}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mt-3">
                        {splitType && (
                          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                            {splitType}
                          </span>
                        )}

                        {indicator && (
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border
                            ${
                          indicator === "You paid"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                          }
                          `}
                          >
                            {indicator}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
                      {new Date(tx.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {isExpanded && tx.splitDetails?.length > 0 && (
                  <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-6 animate-slide-in">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
                      Split Breakdown
                    </h4>

                    <div className="space-y-3">
                      {tx.splitDetails.map((s) => {
                        const name = getMemberName(s.userId);
                        const percent = (
                          (Number(s.shareAmount) / tx.amount) *
                          100
                        ).toFixed(0);

                        return (
                          <div
                            key={s.userId}
                            className="flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/30 p-3 rounded-xl border border-transparent hover:border-gray-100 transition-all"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-black text-gray-800 dark:text-gray-200 tracking-tight">
                                {name}
                              </span>
                              {s.userId === currentUser._id && (
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary-500">
                                  (You)
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-lg font-black text-gray-900 dark:text-white tracking-tighter">
                                ₹{Number(s.shareAmount).toFixed(2)}
                              </span>
                              <span className="text-[10px] font-black text-gray-400 tabular-nums">
                                {percent}%
                              </span>
                            </div>
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

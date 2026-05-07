import { useGroupSummary, useSettleUp } from "../../../services/groupApi";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { uid } from "../../../shared/utils/generateUid";
import { useToast } from "../../../contexts/ToastContext";
import { AvatarBubble } from "../../../shared/components/AvatarBubble";
import { Wallet, Plus, Coins } from "lucide-react";

const GroupSummary = ({ group, groupId }) => {
  const { addToast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { data: summary, isLoading } = useGroupSummary(groupId);
  const { mutate: settleUp } = useSettleUp(groupId);

  const getMemberName = (userId) => {
    const m = group.members.find((x) => x.userId?._id === userId);
    return m?.userId?.firstName || m?.email || "Unknown";
  };

  if (isLoading)
    return (
      <div className="p-8 bg-gray-50 dark:bg-gray-900/40 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800 animate-pulse">
        <p className="text-center text-gray-400 font-black uppercase tracking-widest text-xs">
          Summarizing finances...
        </p>
      </div>
    );

  if (!summary?.settlements?.length)
    return (
      <div
        className="relative overflow-hidden rounded-[2.5rem] p-10 text-white shadow-2xl shadow-emerald-500/20 
                   bg-gradient-to-br from-emerald-500 to-teal-700 group hover:scale-[1.01] transition-transform duration-500"
      >
        <Wallet
          size={160}
          strokeWidth={1}
          className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-125 transition-transform duration-700"
        />

        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-start">
            <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest border border-white/20">
              🎉 Perfectly Balanced!
            </span>
            <div className="text-right opacity-80">
              <p className="text-[10px] font-black uppercase tracking-widest">
                Group total
              </p>
              <p className="text-2xl font-black tracking-tight">
                ₹
                {summary?.totalPaid
                  ?.reduce((acc, m) => acc + m.amount, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-4xl font-black tracking-tighter">
              Fully Settled
            </h2>
            <p className="text-lg opacity-80 font-medium tracking-tight">
              Everyone&apos;s account in this group is clear.
            </p>
          </div>
        </div>
      </div>
    );

  const handleSettle = (from, to, amount) => {
    settleUp(
      { settlements: { id: uid(), from, to, amount } },
      {
        onError: (err) => {
          addToast({
            type: "error",
            title: "Failure",
            message: err?.message || "Error settling balances.",
          });
        },
        onSuccess: () => {
          addToast({
            type: "success",
            title: "Success",
            message: "Balances settled successfully.",
          });
        },
      },
    );
  };

  const yourBalance = summary?.settlements?.reduce((acc, s) => {
    if (s.from.id === user._id) return acc - s.amount;
    if (s.to.id === user._id) return acc + s.amount;
    return acc;
  }, 0);

  return (
    <div className="space-y-6">
      <div
        className={`rounded-[2.5rem] p-8 text-white shadow-2xl transition-all duration-500 hover:scale-[1.02]
        ${
    yourBalance === 0
      ? "bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-500/20"
      : yourBalance < 0
        ? "bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/20"
        : "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20"
    }`}
      >
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">
              Group Balance Insight
            </p>
            <h3 className="text-4xl font-black tracking-tighter">
              {yourBalance === 0 && "Everything's Clear 🎉"}
              {yourBalance < 0 &&
                `You owe ₹${Math.abs(yourBalance.toFixed(2))}`}
              {yourBalance > 0 && `You get ₹${yourBalance.toFixed(2)}`}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">
              Group Total
            </p>
            <p className="text-2xl font-black tracking-tighter">
              ₹
              {summary?.totalPaid
                ?.reduce((sum, m) => sum + m.amount, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>

        {/* Member Contributions Breakdown */}
        <div className="mt-8 pt-7 border-t border-white/15">
          <div className="flex items-center gap-2 mb-4 opacity-80">
            <Coins size={14} className="text-white" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">
              Spending Breakdown
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {summary?.totalPaid
              ?.sort((a, b) => b.amount - a.amount)
              .map((m) => (
                <div
                  key={m.id}
                  className="group/item flex justify-between items-center bg-white/10 hover:bg-white/15 p-3.5 rounded-2xl transition-all duration-300 border border-white/5 hover:border-white/10"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black border border-white/10 shrink-0 group-hover/item:scale-110 transition-transform">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black truncate">
                        {m.name}
                        {m.id === user._id ? " (You)" : ""}
                      </span>
                      <span className="text-[9px] font-bold opacity-60 uppercase tracking-tighter">
                        Contribution
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black tracking-tight shrink-0">
                      ₹
                      {m.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {summary?.settlements.map((s, idx) => {
          const isYouOwe = s.from.id === user._id;

          return (
            <motion.div
              key={idx}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x < -100 && isYouOwe) {
                  handleSettle(s.from.id, s.to.id, s.amount);
                }
              }}
              className="group flex items-center justify-between p-5 rounded-[2rem] 
               bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 
               shadow-xl shadow-gray-200/50 dark:shadow-none hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
            >
              {/* Swipe action visual hint */}
              {isYouOwe && (
                <div className="absolute right-0 top-0 bottom-0 w-24 flex items-center justify-center bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                  Settle →
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="relative">
                  <AvatarBubble
                    email={s.from.to}
                    name={getMemberName(s.from.id)}
                  />
                  <div
                    className={`absolute -right-1 -bottom-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                      isYouOwe ? "bg-rose-500" : "bg-emerald-500"
                    }`}
                  ></div>
                </div>

                <div>
                  <p className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                    {isYouOwe
                      ? `You pay ${getMemberName(s.to.id)}`
                      : `${getMemberName(s.from.id)} pays You`}
                  </p>
                  <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">
                    Pending Settlement
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center gap-4">
                <p
                  className={`text-2xl font-black tracking-tighter ${
                    isYouOwe ? "text-rose-500" : "text-emerald-500"
                  }`}
                >
                  ₹{s.amount.toFixed(2)}
                </p>

                {isYouOwe && (
                  <button
                    onClick={() => handleSettle(s.from.id, s.to.id, s.amount)}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-primary-500 hover:bg-primary-500 hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    <Plus size={20} strokeWidth={3} />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupSummary;

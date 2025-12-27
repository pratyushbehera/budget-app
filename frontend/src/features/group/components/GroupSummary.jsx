import React from "react";
import { useGroupSummary, useSettleUp } from "../../../services/groupApi";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { uid } from "../../../shared/utils/generateUid";
import { useNotification } from "../../../contexts/NotificationContext";
import { AvatarBubble } from "../../../shared/components/AvatarBubble";
import { Wallet } from "lucide-react";

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
      <div
        className="relative overflow-hidden rounded-2xl p-6 text-white shadow-md 
                   bg-gradient-to-r from-emerald-400 to-teal-500 dark:from-emerald-600 dark:to-green-700"
      >
        {/* Soft background icon */}
        <Wallet
          size={90}
          className="absolute -right-4 -bottom-4 opacity-20 text-white"
        />

        <div className="flex flex-col items-start gap-2">
          {/* Celebration badge */}
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium shadow-sm">
            🎉 All Settled!
          </span>

          {/* Main message */}
          <p className="text-lg font-semibold">No pending balances</p>

          <p className="text-sm opacity-90">
            Everyone in this group is fully settled.
          </p>
        </div>
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

  const yourBalance = summary?.settlements?.reduce((acc, s) => {
    if (s.from.id === user._id) return acc - s.amount; // you owe
    if (s.to.id === user._id) return acc + s.amount; // you get
    return acc;
  }, 0);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl p-4 mb-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow">
        <p className="text-sm opacity-90">Your Balance in Group</p>
        <p className="text-2xl font-bold mt-1">
          {yourBalance === 0 && "All Settled 🎉"}
          {yourBalance < 0 && `You owe ₹${Math.abs(yourBalance)}`}
          {yourBalance > 0 && `You are owed ₹${yourBalance}`}
        </p>
      </div>

      {summary?.settlements.map((s, idx) => {
        const isYouOwe = s.from.id === user._id;

        return (
          <motion.div
            key={idx}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x < -60 && isYouOwe) {
                handleSettle(s.from.id, s.to.id, s.amount);
              }
            }}
            className="flex items-center justify-between p-3 rounded-xl 
             bg-indigo-400 dark:bg-blue-900 border border-gray-200 
             dark:border-gray-700 shadow-sm relative overflow-hidden"
          >
            {/* Swipe hint background */}
            {isYouOwe && (
              <div className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center bg-green-600 text-white text-sm">
                Settle →
              </div>
            )}

            {/* LEFT SECTION */}
            <div className="flex items-center gap-3">
              <AvatarBubble email={s.from.to} name={getMemberName(s.from.id)} />

              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-900">
                  {isYouOwe
                    ? `You owe ${getMemberName(s.to.id)}`
                    : `${getMemberName(s.from.id)} owes You`}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-800">
                  ₹{s.amount}
                </p>
              </div>
            </div>

            {/* Right button — only if YOU owe */}
            {isYouOwe && (
              <button
                onClick={() => handleSettle(s.from.id, s.to.id, s.amount)}
                className="px-3 py-1 rounded bg-primary-600 text-white text-sm hover:bg-primary-700"
              >
                Settle
              </button>
            )}
          </motion.div>
        );
      })}
    </div>
    // </div>
  );
};

export default GroupSummary;

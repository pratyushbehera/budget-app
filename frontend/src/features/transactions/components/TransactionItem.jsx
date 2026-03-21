import React from "react";
import { CalendarDays, Pencil, Trash2, Wallet } from "lucide-react";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { categoryIconMap } from "../../../shared/utils/categoryIconMap";
import { useSelector } from "react-redux";

export const TransactionItem = ({ tx, onEdit, onDelete }) => {
  const { groups, loading: isLoading } = useSelector((state) => state.group);
  const isIncome =
    tx.type?.toLowerCase() === "income" ||
    ["salary", "bonus", "interest", "dividend", "other income"].includes(
      tx.category.toLowerCase()
    );

  const Icon = categoryIconMap[tx.category.toLowerCase()] || Wallet;

  return (
    <li
      className="group flex items-center justify-between bg-white dark:bg-gray-900/40 
                 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 
                 hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-300 animate-fade-in"
    >
      {/* LEFT: Icon + Details */}
      <div className="flex items-center gap-5">
        {/* Vibrant Icon Tile */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
            ${isIncome 
              ? "bg-emerald-500 shadow-emerald-500/20 text-white" 
              : "bg-rose-500 shadow-rose-500/20 text-white"}`}
        >
          <Icon size={28} strokeWidth={2.5} />
        </div>

        <div className="space-y-1">
          <p className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-none capitalize">
            {tx.category}
          </p>

          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize opacity-80">
            {tx.notes || "No notes added"}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {/* Group Label */}
            {tx.groupId && !isLoading && (
              <span
                className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg 
                              bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-100 dark:border-primary-800"
              >
                {groups?.find((grp) => grp?._id === tx.groupId)?.name}
              </span>
            )}

            {tx.isRecurring && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                <CalendarDays size={12} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-widest">Recurring</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Amount + Actions */}
      <div className="flex items-center gap-4">
        {/* Amount */}
        <div className="text-right mr-2">
          <p
            className={`text-xl font-black tracking-tighter ${
              isIncome
                ? "text-emerald-500 dark:text-emerald-400"
                : "text-rose-500 dark:text-rose-400"
            }`}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(tx.amount)}
          </p>
        </div>

        {/* Actions Menu */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(tx)}
            className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all duration-300 active:scale-90"
            aria-label="Edit transaction"
          >
            <Pencil size={18} strokeWidth={2.5} />
          </button>

          <button
            onClick={() => onDelete(tx)}
            className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-300 active:scale-90"
            aria-label="Delete transaction"
          >
            <Trash2 size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </li>
  );
};

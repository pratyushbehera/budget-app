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
      className="group flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-gray-900/40 
                 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-800 
                 hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-300 animate-fade-in gap-4"
    >
      {/* LEFT: Icon + Details */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Vibrant Icon Tile */}
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0
            ${isIncome
              ? "bg-emerald-500 shadow-emerald-500/20 text-white"
              : "bg-rose-500 shadow-rose-500/20 text-white"}`}
        >
          <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.5} />
        </div>

        <div className="space-y-1 min-w-0">
          <p className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight leading-none capitalize truncate">
            {tx.category}
          </p>

          <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 capitalize opacity-80 truncate">
            {tx.notes || "No notes added"}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {/* Group Label */}
            {tx.groupId && !isLoading && (
              <span
                className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md 
                               bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-100 dark:border-primary-800"
              >
                {groups?.find((grp) => grp?._id === tx.groupId)?.name}
              </span>
            )}

            {tx.isRecurring && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                <CalendarDays size={10} strokeWidth={3} />
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Recurring</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Amount + Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-none border-gray-50 dark:border-gray-800">
        {/* Amount */}
        <div className="text-left sm:text-right">
          <p
            className={`text-lg sm:text-xl font-black tracking-tighter ${isIncome
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
            className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all duration-300 active:scale-90"
            aria-label="Edit transaction"
          >
            <Pencil size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
          </button>

          <button
            onClick={() => onDelete(tx)}
            className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-300 active:scale-90"
            aria-label="Delete transaction"
          >
            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </li>
  );
};

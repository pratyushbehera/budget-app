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
      className="flex items-center justify-between bg-white dark:bg-gray-950 
                 p-4 rounded-xl border border-gray-200 dark:border-gray-700 
                 hover:shadow-md transition-all"
    >
      {/* LEFT: Icon + Details */}
      <div className="flex items-center gap-4">
        {/* Gradient Icon Tile */}
        <div
          className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 
                        flex items-center justify-center shadow-sm"
        >
          <Icon className="text-white w-5 h-5" />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {tx.category}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {tx.notes || "—"}
          </p>

          <div className="flex items-center gap-2">
            {/* Show group label if part of group */}
            {tx.groupId && !isLoading && (
              <span
                className="text-xs px-2 py-0.5 rounded-md mt-1 inline-block 
                             bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
              >
                {groups?.find((grp) => grp?._id === tx.groupId)?.name}
              </span>
            )}

            {tx.isRecurring && (
              <span className="inline-block gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                <CalendarDays size={16} />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Amount + Actions */}
      <div className="flex items-center gap-3">
        {/* Amount */}
        <p
          className={`text-sm font-semibold ${
            isIncome
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(tx.amount)}
        </p>

        {/* Edit */}
        <button
          onClick={() => onEdit(tx)}
          className="text-blue-500 hover:text-blue-600"
        >
          <Pencil size={16} />
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(tx)}
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
};

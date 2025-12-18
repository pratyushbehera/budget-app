import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { PendingRecurringRow } from "./PendingRecurringRow";

export function PendingRecurringCard({ items = [] }) {
  if (!items.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card px-4 py-3 mb-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Pending recurring transactions
          </h3>
        </div>

        <span className="text-xs text-gray-500">{items.length} pending</span>
      </div>

      {/* List */}
      <div className="space-y-2">
        {items.map((item) => (
          <PendingRecurringRow key={item._id} item={item} />
        ))}
      </div>
    </motion.div>
  );
}

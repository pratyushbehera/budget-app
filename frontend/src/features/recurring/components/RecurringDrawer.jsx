import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { RecurringRuleList } from "./RecurringRuleList";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";
import { useEffect } from "react";

export function RecurringDrawer({ open, onClose, rules }) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className={`fixed z-50 bg-white dark:bg-gray-950 shadow-2xl flex flex-col
              ${
                isDesktop
                  ? "top-0 right-0 h-full w-[420px]"
                  : "bottom-0 left-0 w-full h-[90%] rounded-t-2xl"
              }
            `}
            initial={isDesktop ? { x: "100%" } : { y: "100%" }}
            animate={isDesktop ? { x: 0 } : { y: 0 }}
            exit={isDesktop ? { x: "100%" } : { y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            drag={!isDesktop ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (!isDesktop && info.offset.y > 120) {
                onClose();
              }
            }}
          >
            {/* Drag handle (mobile only) */}
            {!isDesktop && (
              <div className="flex justify-center py-2">
                <div className="w-10 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-800">
              <div>
                <h2 className="text-lg font-semibold">
                  Recurring transactions
                </h2>
                <p className="text-xs text-gray-500">
                  Manage repeating income & expenses
                </p>
              </div>
              <button onClick={onClose}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <RecurringRuleList rules={rules} />
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t dark:border-gray-800 text-xs text-gray-500">
              To create a new recurring transaction, use{" "}
              <span className="font-medium">Add Transaction</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

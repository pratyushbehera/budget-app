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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className={`fixed z-50 bg-white dark:bg-gray-950 shadow-[0_0_50px_rgba(0,0,0,0.3)] flex flex-col
              ${
                isDesktop
                  ? "top-0 right-0 h-full w-[480px] rounded-l-[3.5rem]"
                  : "bottom-0 left-0 w-full h-[90%] rounded-t-[3.5rem]"
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
              <div className="flex justify-center py-4">
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full" />
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-white/5">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Recurring Transactions
                </h2>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">
                  Manage your pulse
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
              <RecurringRuleList rules={rules} />
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-gray-100 dark:border-white/5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
              New rule? Use <span className="text-primary-500">Add Transaction</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

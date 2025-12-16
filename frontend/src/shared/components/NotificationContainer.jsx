import React from "react";
import { useNotification } from "../../contexts/NotificationContext";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  const getStyles = (type) => {
    switch (type) {
      case "error":
        return {
          gradient: "from-red-500/90 to-red-600/90",
          Icon: XCircle,
          text: "text-white",
        };
      case "warning":
        return {
          gradient: "from-yellow-500/90 to-amber-600/90",
          Icon: AlertTriangle,
          text: "text-black",
        };
      case "success":
        return {
          gradient: "from-green-500/90 to-emerald-600/90",
          Icon: CheckCircle,
          text: "text-white",
        };
      default:
        return {
          gradient: "from-blue-500/90 to-indigo-600/90",
          Icon: Info,
          text: "text-white",
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {notifications.map((notification) => {
          const { gradient, Icon, text } = getStyles(notification.type);

          return (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`p-4 rounded-xl shadow-xl bg-gradient-to-r ${gradient} 
                backdrop-blur-sm ${text}`}
            >
              <div className="flex items-start gap-3">
                <Icon size={22} className="flex-shrink-0 mt-0.5" />

                <div className="flex-1">
                  <h4 className="font-semibold leading-tight">
                    {notification.title}
                  </h4>
                  {notification.message && (
                    <p className="text-sm mt-1 opacity-90">
                      {notification.message}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => removeNotification(notification.id)}
                  className="opacity-70 hover:opacity-100 transition"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

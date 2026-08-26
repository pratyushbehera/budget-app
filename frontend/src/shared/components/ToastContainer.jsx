import { useToast } from "../../contexts/ToastContext";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/shared/system/Button";
import Typography from "@/shared/system/Typography";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

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
        {toasts.map((toast) => {
          const { gradient, Icon, text } = getStyles(toast.type);

          return (
            <motion.div
              key={toast.id}
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
                  <Typography variant="h5">{toast.title}</Typography>
                  {toast.message && (
                    <Typography variant="body2">{toast.message}</Typography>
                  )}
                </div>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="border hover:text-tertiary-500 hover:bg-transparent"
                  leftIcon={<X size={16} />}
                  onClick={() => removeToast(toast.id)}
                ></Button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

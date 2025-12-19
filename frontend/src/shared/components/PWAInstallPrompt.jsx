import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { shouldShowPWAPrompt, dismissPWAPrompt } from "../utils/pwaStorage";
import { useSelector } from "react-redux";

export const PWAInstallPrompt = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { deferredPromptRef, canInstall, isInstalled, isIOS } = usePWAInstall();

  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    console.log(isAuthenticated, isInstalled);
    if (!isAuthenticated) return;
    if (isInstalled) return;

    setVisible(shouldShowPWAPrompt());
  }, [isAuthenticated, isInstalled]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isInstalled || !visible) return null;

  const dismiss = () => {
    dismissPWAPrompt();
    setVisible(false);
  };

  const handleInstall = async () => {
    const prompt = deferredPromptRef.current;
    if (!prompt) return;

    prompt.prompt();
    const res = await prompt.userChoice;

    if (res.outcome === "accepted") {
      dismiss();
    }

    deferredPromptRef.current = null;
  };

  return (
    <AnimatePresence>
      <motion.div
        key="pwa"
        initial={isMobile ? { y: "100%" } : { opacity: 0, y: 20 }}
        animate={isMobile ? { y: 0 } : { opacity: 1, y: 0 }}
        exit={isMobile ? { y: "100%" } : { opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        drag={isMobile ? "y" : false}
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120) dismiss();
        }}
        className={
          isMobile
            ? "fixed inset-x-0 bottom-0 z-50"
            : "fixed bottom-6 left-6 z-50 max-w-sm"
        }
      >
        <div
          className="relative rounded-t-2xl md:rounded-2xl p-4 shadow-2xl
          bg-white dark:bg-neutral-900
          border border-neutral-200 dark:border-neutral-800"
        >
          {/* drag handle */}
          {isMobile && (
            <div className="w-10 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mb-3" />
          )}

          <button
            onClick={dismiss}
            className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-600"
          >
            <X size={18} />
          </button>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30">
              <img
                src="/logo.png"
                alt="FinPal Logo"
                className="w-10 h-10 object-contain"
              />
            </div>

            <div className="flex-1">
              <h4 className="font-semibold text-neutral-900 dark:text-white">
                Install FinPal
              </h4>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Track your expenses, set budgets, and achieve your financial
                goals with our intuitive budget tracking application.
              </p>

              {/* ACTION ROW */}
              <div className="mt-4 flex justify-end">
                {isIOS ? (
                  <span className="text-xs text-neutral-500">
                    Share → Add to Home Screen
                  </span>
                ) : (
                  <button
                    onClick={handleInstall}
                    disabled={!canInstall}
                    className={`inline-flex items-center gap-2
                      rounded-lg px-4 py-2 text-sm font-medium text-white
                      ${
                        canInstall
                          ? "bg-primary-600 hover:bg-primary-700"
                          : "bg-neutral-400 cursor-not-allowed"
                      }`}
                  >
                    <Download size={16} />
                    Install
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

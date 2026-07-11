import React, { useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Button from "@/shared/system/Button";
import { ModalContext, useModalContext } from "./modal.context";
import type {
  ModalProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
} from "./modal.types";
import { modalSizeMap } from "./modal.styles";
import Typography from "../Typography";

export function Modal({
  children,
  onClose,
  size = "md",
  closeOnBackdropClick = true,
  closeOnEsc = true,
}: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!closeOnEsc) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeOnEsc, onClose]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <ModalContext.Provider value={{ onClose, titleId }}>
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdropClick ? onClose : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative bg-white dark:bg-gray-950 rounded-[2.5rem] shadow-2xl w-full ${modalSizeMap[size]} flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 dark:border-gray-800`}
          >
            {children}
          </motion.div>
        </div>
      </AnimatePresence>
    </ModalContext.Provider>
  );
}

Modal.Header = function ModalHeader({
  children,
  divider = true,
  hideCloseButton = false,
  className = "",
}: ModalHeaderProps) {
  const { onClose, titleId } = useModalContext();

  return (
    <div
      className={`flex justify-between items-center p-8 pb-4 ${
        divider ? "border-b border-gray-100 dark:border-gray-800" : ""
      } ${className}`}
    >
      <Typography variant="h3" id={titleId}>
        {children}
      </Typography>

      {!hideCloseButton && (
        <Button
          size="icon-sm"
          variant="ghost"
          className="border hover:text-tertiary-500"
          onClick={onClose}
          leftIcon={<X size={20} strokeWidth={2} />}
        />
      )}
    </div>
  );
};

Modal.Body = function ModalBody({ children, className = "" }: ModalBodyProps) {
  return (
    <div
      className={`flex-1 min-h-0 overflow-y-auto px-8 pt-4 pb-8 custom-scrollbar ${className}`}
    >
      {children}
    </div>
  );
};

const footerAlignMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

Modal.Footer = function ModalFooter({
  children,
  divider = true,
  align = "end",
  className = "",
}: ModalFooterProps) {
  return (
    <div
      className={`flex sticky bottom-0 bg-white dark:bg-gray-950 items-center gap-3 px-8 pt-4 pb-8 ${
        divider ? "border-t border-gray-100 dark:border-gray-800" : ""
      } ${footerAlignMap[align]} ${className}`}
    >
      {children}
    </div>
  );
};

import type { ReactNode } from "react";
import { ModalSize } from "./modal.styles";

export interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  size?: ModalSize;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
}

export interface ModalHeaderProps {
  children: ReactNode;
  /** Shows the divider border below the header. Default true. */
  divider?: boolean;
  /** Hides the close (X) button if you want a custom header. */
  hideCloseButton?: boolean;
  className?: string;
}

export interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

export interface ModalFooterProps {
  children: ReactNode;
  /** Shows the divider border above the footer. Default true. */
  divider?: boolean;
  align?: "start" | "center" | "end" | "between";
  className?: string;
}

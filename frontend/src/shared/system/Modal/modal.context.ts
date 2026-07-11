import { createContext, useContext } from "react";

interface ModalContextValue {
  onClose: () => void;
  titleId: string;
}

export const ModalContext = createContext<ModalContextValue | null>(null);

export function useModalContext() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("Modal.Header/Body/Footer must be used inside <Modal>");
  }
  return ctx;
}

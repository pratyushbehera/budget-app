import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { ButtonVariantProps } from "./button.styles";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  /** Shows a spinner and disables the button */
  isLoading?: boolean;
  /** Icon rendered before the label */
  leftIcon?: ReactNode;
  /** Icon rendered after the label */
  rightIcon?: ReactNode;
}

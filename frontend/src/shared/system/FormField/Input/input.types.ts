import type { InputHTMLAttributes, ReactNode } from "react";
import type { FieldWrapperProps } from "../form-field.types";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    FieldWrapperProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

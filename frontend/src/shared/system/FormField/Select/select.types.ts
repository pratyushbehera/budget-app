import type { SelectHTMLAttributes } from "react";
import type { FieldWrapperProps } from "../form-field.types";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">,
    FieldWrapperProps {
  options: SelectOption[];
  placeholder?: string;
}

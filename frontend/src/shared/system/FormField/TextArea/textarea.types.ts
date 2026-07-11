import { TextareaHTMLAttributes } from "react";
import { FieldWrapperProps } from "../form-field.types";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    FieldWrapperProps {}

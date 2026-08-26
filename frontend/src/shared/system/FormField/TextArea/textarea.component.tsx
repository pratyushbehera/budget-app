import React, { forwardRef, useId } from "react";
import { TextareaProps } from "./textarea.types";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      required,
      fieldId,
      className = "",
      id,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || fieldId || generatedId;
    const helperId = `${textareaId}-helper`;
    const errorId = `${textareaId}-error`;

    return (
      <div className="w-full my-2">
        {label && (
          <label htmlFor={textareaId} className="field-label">
            {label}
            {required && <span className="text-tertiary-500 ml-0.5">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`textarea-field ${
            error ? "field-error" : ""
          } ${className}`}
          {...rest}
        />

        {error ? (
          <p id={errorId} className="field-error-text">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="field-helper-text">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

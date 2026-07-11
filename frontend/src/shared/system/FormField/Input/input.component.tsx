import React, { forwardRef, useId } from "react";
import type { InputProps } from "./input.types";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      required,
      fieldId,
      leftIcon,
      rightIcon,
      className = "",
      id,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || fieldId || generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full my-2">
        {label && (
          <label htmlFor={inputId} className="field-label">
            {label}
            {required && <span className="text-tertiary-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={`field-base ${error ? "field-error" : ""} ${
              leftIcon ? "pl-11" : ""
            } ${rightIcon ? "pr-11" : ""} ${className}`}
            {...rest}
          />

          {rightIcon && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </span>
          )}
        </div>

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

Input.displayName = "Input";

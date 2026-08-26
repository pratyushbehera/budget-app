import React, { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";
import type { SelectProps } from "./select.types";

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      required,
      fieldId,
      options,
      placeholder,
      className = "",
      id,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || fieldId || generatedId;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    return (
      <div className="w-full my-2">
        {label && (
          <label htmlFor={selectId} className="field-label">
            {label}
            {required && <span className="text-tertiary-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={`select-field ${
              error ? "field-error" : ""
            } ${className}`}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
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

Select.displayName = "Select";

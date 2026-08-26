import React, { forwardRef, useId } from "react";
import { Check } from "lucide-react";
import { CheckboxProps } from "./checkbox.type";

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = "", id, ...rest }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (
      <div className="w-full">
        <label
          htmlFor={checkboxId}
          className="inline-flex items-center gap-2.5 cursor-pointer"
        >
          <span className="relative inline-flex">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className={`checkbox-base peer ${className}`}
              {...rest}
            />
            <Check
              size={14}
              strokeWidth={3}
              className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
            />
          </span>
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
        </label>

        {error && <p className="field-error-text">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

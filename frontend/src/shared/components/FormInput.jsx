import React, { forwardRef } from "react";

export const FormInput = forwardRef(
    ({ label, error, type = "text", className = "", ...props }, ref) => {
        return (
            <div className={className}>
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    type={type}
                    className={`input-field ${error
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {error.message}
                    </p>
                )}
            </div>
        );
    }
);

FormInput.displayName = "FormInput";

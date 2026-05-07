import { forwardRef } from "react";

export const FormInput = forwardRef(
  ({ label, error, type = "text", className = "", ...props }, ref) => {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label className="block text-[13px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={`input-field shadow-sm border-2 dark:bg-gray-100 ${
            error
              ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-transparent"
          } transition-all duration-300`}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 ml-1 animate-slide-in">
            {error.message}
          </p>
        )}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";

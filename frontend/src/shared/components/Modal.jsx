import React from "react";

export function Modal({ title, children, onClose, maxWidth = "max-w-md" }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`bg-white dark:bg-gray-50 rounded-xl p-6 w-full ${maxWidth} shadow-lg border dark:border-gray-700 max-h-screen`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        <div className="overflow-scroll max-h-[80vh] px-2">{children}</div>
      </div>
    </div>
  );
}

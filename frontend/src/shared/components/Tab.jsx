import React from "react";

const Tab = ({ tabs = [], active, onChange }) => {
  return (
    <div className="flex gap-2 p-1.5 bg-gray-100/50 dark:bg-gray-800/40 rounded-2xl w-fit">
      {tabs.map((t) => {
        const isActive = active === t.value;

        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={`
              px-6 py-2.5 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-xl
              ${
                isActive
                  ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
              }
            `}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tab;

import React from "react";

const Tab = ({ tabs = [], active, onChange }) => {
  return (
    <div className="flex gap-6 border-b border-gray-300 dark:border-gray-700 pb-2">
      {tabs.map((t) => {
        const isActive = active === t.value;

        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={`
              text-sm font-medium transition-all pb-1
              ${
                isActive
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 dark:text-gray-400 hover:text-primary"
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

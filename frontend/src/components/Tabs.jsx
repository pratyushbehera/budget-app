import React from "react";
import PropTypes from "prop-types";

export function Tabs({ children, activeTab, onTabChange }) {
  const tabs = React.Children.toArray(children).map((child) => ({
    label: child.props.label,
    value: child.props.value,
    content: child,
  }));

  return (
    <div className="w-full">
      <div className="flex flex-wrap border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out ${
              activeTab === tab.value
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find((tab) => tab.value === activeTab)?.content}
      </div>
    </div>
  );
}

export function TabContent({ children, label, value }) {
  return (
    <div className="w-full" data-label={label} data-value={value}>
      {children}
    </div>
  );
}

Tabs.propTypes = {
  children: PropTypes.node.isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

TabContent.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

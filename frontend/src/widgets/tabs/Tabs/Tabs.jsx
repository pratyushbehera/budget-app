import { useApp } from "../../../app/store";

export function Tabs({ children }) {
  const { state, actions } = useApp();
  const { activeTab } = state;

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "transactions", label: "Transactions" },
    { id: "plans", label: "Plans" },
    { id: "insights", label: "Insights" },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => actions.setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">{children}</div>
    </div>
  );
}

export function TabContent({ children, value }) {
  const { state } = useApp();
  const { activeTab } = state;

  if (activeTab !== value) {
    return null;
  }

  return <div>{children}</div>;
}

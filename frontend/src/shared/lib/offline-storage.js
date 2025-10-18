// Offline storage utilities
export const offlineStorage = {
  // Get offline actions from localStorage
  getOfflineActions: () => {
    try {
      const raw = localStorage.getItem("offline_actions");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Error reading offline actions from localStorage:", e);
      return [];
    }
  },

  // Save offline action to localStorage
  saveOfflineAction: (action) => {
    const actions = offlineStorage.getOfflineActions();
    actions.push(action);
    localStorage.setItem("offline_actions", JSON.stringify(actions));
  },

  // Remove offline actions from localStorage
  removeOfflineActions: (indices) => {
    const actions = offlineStorage.getOfflineActions();
    indices.reverse().forEach((index) => {
      actions.splice(index, 1);
    });
    localStorage.setItem("offline_actions", JSON.stringify(actions));
  },

  // Save transactions to localStorage
  saveTransactions: (transactions) => {
    localStorage.setItem("offline_transactions", JSON.stringify(transactions));
  },

  // Get transactions from localStorage
  getTransactions: () => {
    try {
      const raw = localStorage.getItem("offline_transactions");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Error reading transactions from localStorage:", e);
      return [];
    }
  },

  // Save plans to localStorage
  savePlans: (plans) => {
    localStorage.setItem("budget_plans_v1", JSON.stringify(plans));
  },

  // Get plans from localStorage
  getPlans: () => {
    try {
      const raw = localStorage.getItem("budget_plans_v1");
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.error("Error reading plans from localStorage:", e);
      return {};
    }
  },
};

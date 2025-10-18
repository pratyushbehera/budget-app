// API layer for budget app

// API base URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Create authenticated fetch function
export function createAuthFetch(userToken, logoutUser) {
  return async (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(userToken && { Authorization: `Bearer ${userToken}` }),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      logoutUser();
      throw new Error("Unauthorized: Please log in again.");
    }

    return response;
  };
}

// API endpoints
export const API_ENDPOINTS = {
  TRANSACTIONS: `${API_BASE_URL}/transactions`,
  PLANS: `${API_BASE_URL}/plans`,
  INSIGHTS: `${API_BASE_URL}/insights`,
  GENERATE_INSIGHT: `${API_BASE_URL}/generate-insight`,
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    SIGNUP: `${API_BASE_URL}/auth/signup`,
  },
};

// Transaction API functions
export const transactionAPI = {
  fetchAll: async (authFetch) => {
    const response = await authFetch(API_ENDPOINTS.TRANSACTIONS);
    return response.json();
  },

  create: async (authFetch, transaction) => {
    const response = await authFetch(API_ENDPOINTS.TRANSACTIONS, {
      method: "POST",
      body: JSON.stringify(transaction),
    });
    return response.json();
  },

  delete: async (authFetch, id) => {
    const response = await authFetch(`${API_ENDPOINTS.TRANSACTIONS}/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};

// Plans API functions
export const plansAPI = {
  fetchAll: async (authFetch) => {
    const response = await authFetch(API_ENDPOINTS.PLANS);
    return response.json();
  },

  update: async (authFetch, plans) => {
    const response = await authFetch(API_ENDPOINTS.PLANS, {
      method: "POST",
      body: JSON.stringify({ data: plans }),
    });
    return response.json();
  },
};

// Insights API functions
export const insightsAPI = {
  fetch: async (authFetch, year, month) => {
    const response = await authFetch(
      `${API_ENDPOINTS.INSIGHTS}/${year}/${month}`,
    );
    return response.json();
  },

  create: async (authFetch, insightData) => {
    const response = await authFetch(API_ENDPOINTS.INSIGHTS, {
      method: "POST",
      body: JSON.stringify(insightData),
    });
    return response.json();
  },

  generate: async (authFetch, prompt) => {
    const response = await authFetch(API_ENDPOINTS.GENERATE_INSIGHT, {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });
    return response.json();
  },
};

// Auth API functions
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  signup: async (userData) => {
    const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return response.json();
  },
};

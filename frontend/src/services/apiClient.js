const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

async function apiClient(path, options = {}) {
  const token = localStorage.getItem("auth-token");

  // Auto-attach token (if exists)
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  console.log("xxx", API_BASE_URL, path);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Handle unauthorized
  if (response.status === 401) {
    localStorage.removeItem("auth-token");
  }

  // Try parse JSON safely
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `API error: ${response.status}`);
  }

  return data;
}

export const api = {
  get: (path) => apiClient(path, { method: "GET" }),
  post: (path, body) =>
    apiClient(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) =>
    apiClient(path, { method: "PUT", body: JSON.stringify(body) }),
  del: (path) => apiClient(path, { method: "DELETE" }),
};

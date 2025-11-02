import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const getDashboard = async (month) => {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const url = new URL(`${API_BASE_URL}/api/dashboard`);
  if (month) url.searchParams.append("month", month);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("auth-token");
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch transaction: ${response.status}`
    );
  }

  return response.json();
};

export const useDashboard = (month) => {
  return useQuery({
    queryKey: ["dashboard", month || "all"],
    queryFn: () => getDashboard(month),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem("auth-token"),
  });
};

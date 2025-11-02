import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const getPlan = async () => {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const url = new URL(`${API_BASE_URL}/api/plans`);
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
      errorData.message || `Failed to fetch plan: ${response.status}`
    );
  }

  return response.json();
};

const savePlan = async ({ plan }) => {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/api/plans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(plan),
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("auth-token");
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to save plan: ${response.status}`
    );
  }

  return response.json();
};

export const usePlan = () => {
  return useQuery({
    queryKey: ["plans"],
    queryFn: getPlan,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem("auth-token"),
  });
};

export const useSavePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ plan }) => savePlan({ plan }),
    onSuccess: () => {
      // Refresh cached transactions to reflect edit
      queryClient.invalidateQueries(["plans"]);
    },
    onError: (error) => {
      console.error("Failed to save plan:", error?.message);
    },
  });
};

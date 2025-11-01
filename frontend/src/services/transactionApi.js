import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const getTransaction = async ({ month, limit }) => {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const url = new URL(`${API_BASE_URL}/api/transactions`);
  if (month) url.searchParams.append("month", month);
  if (limit) url.searchParams.append("limit", limit);
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

const addTransaction = async ({ transaction }) => {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("auth-token");
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to add transaction: ${response.status}`
    );
  }

  return response.json();
};

const deleteTransaction = async (id) => {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
    method: "DELETE",
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
      errorData.message || `Failed to delete transaction: ${response.status}`
    );
  }

  return response.json();
};

const editTransaction = async ({ id, updates }) => {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("auth-token");
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to update transaction: ${response.status}`
    );
  }

  return response.json();
};

export const useTransaction = ({ month, limit } = {}) => {
  return useQuery({
    queryKey: ["transactions", month || "all", limit || "no-limit"],
    queryFn: () => getTransaction({ month, limit }),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem("auth-token"),
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteTransaction(id),
    onSuccess: () => {
      // Refresh all cached transaction lists
      queryClient.invalidateQueries(["transactions"]);
    },
    onError: (error) => {
      console.error("Failed to delete transaction:", error.message);
    },
  });
};

export const useEditTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => editTransaction({ id, updates }),
    onSuccess: () => {
      // Refresh cached transactions to reflect edit
      queryClient.invalidateQueries(["transactions"]);
    },
    onError: (error) => {
      console.error("Failed to edit transaction:", error.message);
    },
  });
};

export const useAddTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ transaction }) => addTransaction({ transaction }),
    onSuccess: () => {
      // Refresh cached transactions to reflect edit
      queryClient.invalidateQueries(["transactions"]);
    },
    onError: (error) => {
      console.error("Failed to add transaction:", error.message);
    },
  });
};

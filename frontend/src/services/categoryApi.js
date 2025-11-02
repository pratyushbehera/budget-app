import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const getCategory = async ({ month, limit }) => {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/api/categories`, {
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
      errorData.message || `Failed to fetch categories: ${response.status}`
    );
  }

  return response.json();
};

const addCategory = async ({ category }) => {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/api/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("auth-token");
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to add category: ${response.status}`
    );
  }

  return response.json();
};

const deleteCategory = async (id) => {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
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
      errorData.message || `Failed to delete category: ${response.status}`
    );
  }

  return response.json();
};

export const useCategory = ({ month, limit } = {}) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem("auth-token"),
  });
};
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => {
      // Refresh all cached category lists
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (error) => {
      console.error("Failed to delete category:", error.message);
    },
  });
};
export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ category }) => addCategory({ category }),
    onSuccess: () => {
      // Refresh cached transactions to reflect edit
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (error) => {
      console.error("Failed to add category:", error.message);
    },
  });
};

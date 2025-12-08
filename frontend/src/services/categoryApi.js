import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./apiClient";

export const useCategory = (userId) => {
  return useQuery({
    queryKey: ["categories", userId],
    queryFn: () => api.get("/api/categories"),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem("auth-token") && !!userId,
  });
};
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => api.del(`/api/categories/${id}`),
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
    mutationFn: ({ category }) => api.post("/api/categories", category),
    onSuccess: () => {
      // Refresh cached transactions to reflect edit
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (error) => {
      console.error("Failed to add category:", error.message);
    },
  });
};

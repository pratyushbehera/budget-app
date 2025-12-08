import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./apiClient";

// =============================
// 🔹 GET Transactions
// =============================
export const useTransaction = ({ month, limit } = {}) => {
  return useQuery({
    queryKey: ["transactions", month || "all", limit || "no-limit"],
    queryFn: () => {
      const params = new URLSearchParams();
      if (month) params.append("month", month);
      if (limit) params.append("limit", limit);

      const queryString = params.toString();
      const path = queryString
        ? `/api/transactions?${queryString}`
        : `/api/transactions`;

      return api.get(path);
    },
    enabled: !!localStorage.getItem("auth-token"),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// =============================
// 🔹 ADD Transaction
// =============================
export const useAddTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ transaction }) => api.post("/api/transactions", transaction),

    onSuccess: () => {
      queryClient.invalidateQueries(["transactions"]);
    },
  });
};

// =============================
// 🔹 EDIT Transaction
// =============================
export const useEditTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) =>
      api.put(`/api/transactions/${id}`, updates),

    onSuccess: () => {
      queryClient.invalidateQueries(["transactions"]);
    },
  });
};

// =============================
// 🔹 DELETE Transaction
// =============================
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => api.del(`/api/transactions/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries(["transactions"]);
    },
  });
};

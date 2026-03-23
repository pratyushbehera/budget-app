import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./apiClient";

// =============================
// 🔹 GET Transactions
// =============================
export const useTransaction = ({ month, startDate, endDate, limit } = {}) => {
  return useQuery({
    queryKey: ["transactions", month, startDate, endDate, limit],
    queryFn: () => {
      const params = new URLSearchParams();
      if (month) params.append("month", month);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
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

// =============================
// 🔹 GET Transactions by Date Range (for Insights)
// =============================
export const fetchTransactionsByDateRange = async ({ startDate, endDate }) => {
  const params = new URLSearchParams();
  params.append("startDate", startDate);
  params.append("endDate", endDate);

  return api.get(`/api/transactions?${params.toString()}`);
};

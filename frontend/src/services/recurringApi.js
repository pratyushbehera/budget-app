import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./apiClient";

// =============================
// 🔁 GET Pending Recurring
// =============================
export const usePendingRecurring = () => {
  return useQuery({
    queryKey: ["recurring", "pending"],
    queryFn: () => api.get("/api/recurring-instances?status=pending"),

    enabled: !!localStorage.getItem("auth-token"),
    staleTime: 60 * 1000, // 1 min (these change often)
    retry: 1,
  });
};

export const useApproveRecurring = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, amount, date }) =>
      api.post(`/api/recurring-instances/${id}/approve`, {
        amount,
        date,
      }),

    onSuccess: () => {
      qc.invalidateQueries(["recurring", "pending"]);
      qc.invalidateQueries(["transactions"]);
    },
  });
};

export const useSkipRecurring = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => api.post(`/api/recurring-instances/${id}/skip`),

    onSuccess: () => {
      qc.invalidateQueries(["recurring", "pending"]);
    },
  });
};

export const useRecurringRules = () => {
  return useQuery({
    queryKey: ["recurring", "rules"],
    queryFn: () => api.get("/api/recurring-rules"),
    enabled: !!localStorage.getItem("auth-token"),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateRecurringRules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rules) => {
      console.log(rules);
      api.post("/api/recurring-rules", rules);
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["recurring", "rules"]);
    },
  });
};

export const useStopRecurringRule = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => api.post(`/api/recurring-rules/${id}/stop`),

    onSuccess: () => {
      qc.invalidateQueries(["recurring", "rules"]);
      qc.invalidateQueries(["recurring", "pending"]);
    },
  });
};

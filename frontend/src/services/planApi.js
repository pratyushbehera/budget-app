import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./apiClient";

// =============================
// 🔹 GET Plans
// =============================
export const usePlan = () => {
  return useQuery({
    queryKey: ["plans"],
    queryFn: () => api.get("/api/plans"),
    enabled: !!localStorage.getItem("auth-token"),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// =============================
// 🔹 SAVE / UPDATE Plan
// =============================
export const useSavePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ plan }) => api.post("/api/plans", plan),

    onSuccess: () => {
      queryClient.invalidateQueries(["plans"]);
    },
  });
};

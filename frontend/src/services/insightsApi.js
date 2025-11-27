import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchInsights = async (year, month, token) => {
  const response = await fetch(
    `${API_BASE_URL}/api/insights/${year}/${month}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.json();
};

export const generateInsights = async (payload, token) => {
  console.log(payload);
  const response = await fetch(`${API_BASE_URL}/api/insights/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return response.json();
};

export const useInsights = (selectedMonth, userProfile) => {
  const [year, month] = selectedMonth?.split("-");
  const token = localStorage.getItem("auth-token");
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["insights", year, month],
    queryFn: () => fetchInsights(year, month, token),
  });

  const mutation = useMutation({
    mutationFn: (budgets, transactions) =>
      generateInsights(
        {
          year,
          month,
          userProfile,
          transactions,
          budgets,
        },
        token
      ),
    onSuccess: (response) => {
      queryClient.setQueryData(["insights", year, month], response.content);
    },
  });

  const ensureInsights = (budgets, transactions) => {
    // If empty array, trigger generation
    if (!data || data.length === 0) {
      mutation.mutate(budgets, transactions);
    }
  };

  return {
    insights: data || [],
    isLoading,
    generate: (budgets, transactions) => ensureInsights(budgets, transactions),
    refetch,
  };
};

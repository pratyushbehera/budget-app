import { useQuery } from "@tanstack/react-query";
import { api } from "./apiClient";

export const useDashboard = ({ month, startDate, endDate }) => {
  return useQuery({
    queryKey: ["dashboard", month, startDate, endDate],
    queryFn: () => {
      const params = new URLSearchParams();
      if (month) params.append("month", month);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const queryString = params.toString();
      const path = queryString
        ? `/api/dashboard?${queryString}`
        : `/api/dashboard`;

      return api.get(path);
    },
    enabled: !!localStorage.getItem("auth-token"),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

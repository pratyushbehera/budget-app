import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./apiClient";

// Fetch notifications
export const useNotifications = () => {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: () => api.get("/api/notifications"),
        refetchInterval: 30000, // Refresh every 30 seconds
    });
};

// Mark single as read
export const useMarkRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => api.put(`/api/notifications/${id}/read`),
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
        },
    });
};

// Mark all as read
export const useMarkAllRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => api.put("/api/notifications/read-all"),
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
        },
    });
};

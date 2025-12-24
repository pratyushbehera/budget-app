import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./apiClient";

/* -----------------------------------------------------
   GROUP FETCHING
----------------------------------------------------- */

export const useGroups = (userId) =>
  useQuery({
    queryKey: ["groups", userId],
    queryFn: () => api.get("/api/groups"),
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem("auth-token") && !!userId,
  });

export const useGroup = (groupId) =>
  useQuery({
    queryKey: ["group", groupId],
    queryFn: () => api.get(`/api/groups/${groupId}`),
    enabled: !!groupId,
  });

export const useGroupTransactions = (groupId) =>
  useQuery({
    queryKey: ["group", groupId, "transactions"],
    queryFn: () => api.get(`/api/groups/${groupId}/transactions`),
    enabled: !!groupId,
  });

export const useGroupSummary = (groupId) =>
  useQuery({
    queryKey: ["group", groupId, "summary"],
    queryFn: () => api.get(`/api/groups/${groupId}/summary`),
    enabled: !!groupId,
  });

export const useGroupActivity = (groupId) =>
  useQuery({
    queryKey: ["group-activity", groupId],
    queryFn: () => api.get(`/api/groups/${groupId}/activity`),
    enabled: !!groupId,
    refetchInterval: 15000,
  });

/* -----------------------------------------------------
   CREATE & UPDATE
----------------------------------------------------- */

export const useCreateGroup = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (group) => api.post("/api/groups", group),
    onSuccess: () => qc.invalidateQueries(["groups"]),
  });
};

export const useUpdateGroup = (groupId) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ group }) => api.put(`/api/groups/${groupId}`, group),
    onSuccess: () => qc.invalidateQueries(["group", groupId]),
  });
};

/* -----------------------------------------------------
   SETTLEMENT
----------------------------------------------------- */

export const useSettleUp = (groupId) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ settlements }) =>
      api.post(`/api/groups/${groupId}/settle`, settlements),

    onSuccess: () => {
      qc.invalidateQueries(["group-summary", groupId]);
      qc.invalidateQueries(["group-transactions", groupId]);
    },
  });
};

/* -----------------------------------------------------
   MEMBERSHIP MANAGEMENT
----------------------------------------------------- */

export const useRemoveMember = (groupId) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (member) => api.post(`/api/groups/${groupId}/remove`, member),

    onSuccess: () => qc.invalidateQueries(["group", groupId]),
  });
};

export const useLeaveGroup = (groupId) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => api.post(`/api/groups/${groupId}/leave`),
    onSuccess: () => qc.invalidateQueries(["groups"]),
  });
};

export const useInviteMember = (groupId) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (member) => api.post(`/api/groups/${groupId}/invite`, member),

    onSuccess: () => qc.invalidateQueries(["group", groupId]),
  });
};

export const useAcceptInvite = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (groupId) =>
      api.post("/api/groups/invites/accept", { groupId }),

    onSuccess: () => qc.invalidateQueries(["groups"]),
  });
};

/* -----------------------------------------------------
   DELETE GROUP
----------------------------------------------------- */

export const useDeleteGroup = (groupId) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => api.del(`/api/groups/${groupId}`),

    onSuccess: () => {
      qc.invalidateQueries(["groups"]);
      window.location.href = "/dashboard";
    },
  });
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// GET /api/groups
export const fetchGroups = async () => {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/api/groups`, {
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
      errorData.message || `Failed to fetch groups: ${response.status}`
    );
  }

  return response.json();
};

// GET /api/groups/:groupId
export const fetchGroupDetails = async (groupId) => {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/api/groups/${groupId}`, {
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
      errorData.message || `Failed to fetch group by Id: ${response.status}`
    );
  }

  return response.json();
};

// POST /api/groups
export const createGroup = async (group) => {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/api/groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(group),
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("auth-token");
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to create group: ${response.status}`
    );
  }

  return response.json();
};

export const fetchGroupTransactions = async (groupId) => {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/groups/${groupId}/transactions`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("auth-token");
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Failed to fetch group transactions: ${response.status}`
    );
  }

  return response.json();
};

export const getGroupSummary = async (groupId) => {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/groups/${groupId}/summary`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("auth-token");
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch group summary: ${response.status}`
    );
  }

  return response.json();
};

export const useGroups = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
    staleTime: 1000 * 60 * 5, // 5 minutes caching
  });
};

export const useGroup = (groupId) => {
  return useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetchGroupDetails(groupId),
    enabled: !!groupId,
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(["groups"]);
    },
  });
};

export const useGroupTransactions = (groupId) => {
  return useQuery({
    queryKey: ["group", groupId, "transactions"],
    queryFn: () => fetchGroupTransactions(groupId),
    enabled: !!groupId,
  });
};

export const useGroupSummary = (groupId) => {
  return useQuery({
    queryKey: ["group", groupId, "summary"],
    queryFn: () => getGroupSummary(groupId),
    enabled: !!groupId,
  });
};

export const settleTransaction = async ({ groupId, settlements }) => {
  //from, to, amount
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/api/groups/${groupId}/settle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settlements),
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("auth-token");
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to settle transaction: ${response.status}`
    );
  }

  return response.json();
};

export const useSettleUp = (groupId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ settlements }) =>
      settleTransaction({ groupId, settlements }),
    onSuccess: () => {
      qc.invalidateQueries(["group-summary", groupId]);
      qc.invalidateQueries(["group-transactions", groupId]);
    },
  });
};

export const updateGroup = async ({ group }, groupId) => {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/api/groups/${groupId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(group),
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("auth-token");
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to update group: ${response.status}`
    );
  }

  return response.json();
};

export const useUpdateGroup = (groupId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateGroup(data, groupId),
    onSuccess: () => qc.invalidateQueries(["group", groupId]),
  });
};

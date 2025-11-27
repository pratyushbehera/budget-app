// services/chatApi.js

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const streamChatResponse = async function* (
  query,
  categoryPlanUsage,
  token
) {
  const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, categoryPlanUsage }),
  });

  if (!response.ok) {
    throw new Error("Chat request failed");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    yield chunk;
  }
};

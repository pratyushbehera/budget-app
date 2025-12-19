const KEY = "pwaPromptDismissedAt";
const TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export const shouldShowPWAPrompt = () => {
  const last = localStorage.getItem(KEY);
  if (!last) return true;
  return Date.now() - Number(last) > TTL;
};

export const dismissPWAPrompt = () => {
  localStorage.setItem(KEY, Date.now().toString());
};

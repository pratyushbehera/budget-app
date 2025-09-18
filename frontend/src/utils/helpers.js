export function formatCurrency(n) {
  if (!n && n !== 0) return "-";
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}

export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

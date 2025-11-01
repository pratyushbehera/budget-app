export function formatCurrency(n) {
  if (!n && n !== 0) return "-";
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

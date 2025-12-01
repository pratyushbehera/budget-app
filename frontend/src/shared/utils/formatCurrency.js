export function formatCurrency(n) {
  if (!n && n !== 0) return "-";
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

export function convertToShortForm(number) {
  if (number >= 100000) {
      // Convert to Lakh (L)
      // 1 Lakh = 100,000
      const value = number / 100000;
      // Use .toFixed(1) to keep one decimal place, if needed, or Math.floor() for whole numbers
      return value.toFixed(1) + 'L';
  } else if (number >= 1000) {
      // Convert to Thousand (T)
      // 1 Thousand = 1,000
      const value = number / 1000;
      return value.toFixed(0) + 'T'; // Whole number for thousands
  } else {
      return number.toString();
  }
}
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const todayISO = () => new Date().toISOString().split("T")[0];

export const formatMonthYear = (yyyyMm) => {
  if (!yyyyMm) return "";

  const [year, month] = yyyyMm.split("-");

  if (!year || !month) return yyyyMm;

  const date = new Date(Number(year), Number(month) - 1);

  return date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
};

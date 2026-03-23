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

  if (!year && !month) return yyyyMm;
  if (year && !month) return year; // Just year

  const date = new Date(Number(year), Number(month) - 1);

  return date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
};

export const getStartEndDate = (date, mode) => {
  const start = new Date(date);
  const end = new Date(date);

  if (mode === "month") {
    start.setDate(1);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
  } else if (mode === "year") {
    start.setMonth(0, 1);
    end.setMonth(11, 31);
  }

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
};

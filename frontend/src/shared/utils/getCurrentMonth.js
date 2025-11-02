export const getCurrentMonth = () => {
  const date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}`;
};

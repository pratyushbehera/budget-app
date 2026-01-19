export const splitWeeklyTransactions = (transactions) => {
  const now = new Date();

  const startOfCurrentWeek = new Date(now);
  startOfCurrentWeek.setDate(now.getDate() - 7);

  const startOfPreviousWeek = new Date(now);
  startOfPreviousWeek.setDate(now.getDate() - 14);

  const currentWeekTransactions = [];
  const previousWeekTransactions = [];

  transactions.forEach((tx) => {
    const txDate = new Date(tx.date);

    if (txDate >= startOfCurrentWeek) {
      currentWeekTransactions.push(tx);
    } else if (txDate >= startOfPreviousWeek && txDate < startOfCurrentWeek) {
      previousWeekTransactions.push(tx);
    }
  });

  return {
    currentWeekTransactions,
    previousWeekTransactions,
  };
};

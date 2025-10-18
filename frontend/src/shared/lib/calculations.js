import { DEFAULT_CATEGORIES } from "../../utils/constants";

// Calculate sums by category
export const calculateSumsByCategory = (transactions) => {
  const sums = {};
  for (const transaction of transactions) {
    sums[transaction.category] =
      (sums[transaction.category] || 0) + Number(transaction.amount);
  }
  return sums;
};

// Calculate income total
export const calculateIncomeTotal = (sumsByCategory) => {
  return Object.keys(sumsByCategory)
    .filter((category) => DEFAULT_CATEGORIES.Income.includes(category))
    .reduce((sum, category) => sum + (sumsByCategory[category] || 0), 0);
};

// Calculate expense total
export const calculateExpenseTotal = (sumsByCategory) => {
  return Object.keys(sumsByCategory)
    .filter((category) => !DEFAULT_CATEGORIES.Income.includes(category))
    .reduce((sum, category) => sum + (sumsByCategory[category] || 0), 0);
};

// Calculate savings
export const calculateSavings = (incomeTotal, expenseTotal) => {
  return incomeTotal - expenseTotal;
};

// Calculate savings percentage
export const calculateSavingsPercentage = (incomeTotal, savings) => {
  return incomeTotal ? (savings / incomeTotal) * 100 : 0;
};

// Calculate pie chart data (Needs, Wants, Savings/Investments)
export const calculatePieData = (sumsByCategory) => {
  const needsSum = Object.keys(sumsByCategory)
    .filter((category) => DEFAULT_CATEGORIES["Fixed Needs"].includes(category))
    .reduce((sum, category) => sum + (sumsByCategory[category] || 0), 0);

  const wantsSum = Object.keys(sumsByCategory)
    .filter((category) =>
      DEFAULT_CATEGORIES["Variable Wants"].includes(category),
    )
    .reduce((sum, category) => sum + (sumsByCategory[category] || 0), 0);

  const savingsInvestSum = Object.keys(sumsByCategory)
    .filter((category) =>
      DEFAULT_CATEGORIES["Savings & Investments"].includes(category),
    )
    .reduce((sum, category) => sum + (sumsByCategory[category] || 0), 0);

  return [
    { name: "Needs", value: needsSum },
    { name: "Wants", value: wantsSum },
    { name: "Savings/Investments", value: savingsInvestSum },
  ];
};

// Calculate 50/30/20 rule breakdown
export const calculate503020Breakdown = (incomeTotal, sumsByCategory) => {
  const allocatedNeeds = incomeTotal * 0.5;
  const allocatedWants = incomeTotal * 0.2;
  const allocatedSavings = incomeTotal * 0.3;

  const needsSum = Object.keys(sumsByCategory)
    .filter((category) => DEFAULT_CATEGORIES["Fixed Needs"].includes(category))
    .reduce((sum, category) => sum + (sumsByCategory[category] || 0), 0);

  const wantsSum = Object.keys(sumsByCategory)
    .filter((category) =>
      DEFAULT_CATEGORIES["Variable Wants"].includes(category),
    )
    .reduce((sum, category) => sum + (sumsByCategory[category] || 0), 0);

  const savingsInvestSum = Object.keys(sumsByCategory)
    .filter((category) =>
      DEFAULT_CATEGORIES["Savings & Investments"].includes(category),
    )
    .reduce((sum, category) => sum + (sumsByCategory[category] || 0), 0);

  return {
    needs: {
      allocated: allocatedNeeds,
      actual: needsSum,
      remaining: allocatedNeeds - needsSum,
      percentage: 50,
    },
    wants: {
      allocated: allocatedWants,
      actual: wantsSum,
      remaining: allocatedWants - wantsSum,
      percentage: 20,
    },
    savings: {
      allocated: allocatedSavings,
      actual: savingsInvestSum,
      remaining: allocatedSavings - savingsInvestSum,
      percentage: 30,
    },
  };
};

// Calculate monthly trend data
export const calculateMonthlyTrend = (transactions) => {
  const incomeMap = {};
  const expenseMap = {};

  for (const transaction of transactions) {
    const month = transaction.date.slice(0, 7); // YYYY-MM
    if (DEFAULT_CATEGORIES.Income.includes(transaction.category)) {
      incomeMap[month] = (incomeMap[month] || 0) + Number(transaction.amount);
    } else {
      expenseMap[month] = (expenseMap[month] || 0) + Number(transaction.amount);
    }
  }

  const allMonths = Array.from(
    new Set([...Object.keys(incomeMap), ...Object.keys(expenseMap)]),
  ).sort();

  return allMonths.map((month) => ({
    month,
    income: incomeMap[month] || 0,
    expense: expenseMap[month] || 0,
  }));
};

// Filter transactions by month and year
export const filterTransactionsByMonth = (transactions, year, month) => {
  return transactions.filter((transaction) =>
    transaction.date.startsWith(`${year}-${month}`),
  );
};

// Filter transactions by category and search text
export const filterTransactions = (
  transactions,
  categoryFilter,
  searchText,
) => {
  return transactions.filter((transaction) => {
    if (categoryFilter !== "All" && transaction.category !== categoryFilter) {
      return false;
    }
    if (
      searchText &&
      !`${transaction.notes} ${transaction.category}`
        .toLowerCase()
        .includes(searchText.toLowerCase())
    ) {
      return false;
    }
    return true;
  });
};

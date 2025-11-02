const { Transaction, Plan } = require("../models/Budget");
const Category = require("../models/Category");

exports.getDashboard = async (req, res) => {
  try {
    const { month } = req.query;
    const userId = req.user.id;

    // Parse selected month
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const currentYear = startDate.getFullYear().toString();
    const currentMonthIndex = startDate.getMonth(); // 0-based (0 = Jan)

    // Fetch transactions, categories, and plan in parallel
    const [transactions, categories, plan] = await Promise.all([
      Transaction.find({
        userId,
        date: {
          $gte: startDate.toISOString().split("T")[0],
          $lt: endDate.toISOString().split("T")[0],
        },
      }),
      Category.find({ userId }),
      Plan.findOne({ userId }),
    ]);

    // Category mapping
    const catMap = {};
    categories.forEach(
      (cat) =>
        (catMap[cat._id] = {
          name: cat.name,
          group: cat.group,
          type: cat.type,
        })
    );

    // Split into income and expense
    const incomeTxns = transactions.filter((t) => {
      let categoryId = t.categoryId;
      if (!categoryId)
        categoryId = categories.find((c) => c.name === t.category)?._id;
      return catMap[categoryId]?.type === "Income";
    });

    const expenseTxns = transactions.filter((t) => {
      let categoryId = t.categoryId;
      if (!categoryId)
        categoryId = categories.find((c) => c.name === t.category)?._id;
      return catMap[categoryId]?.type === "Expense";
    });

    const totalIncome = incomeTxns.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = expenseTxns.reduce((sum, t) => sum + t.amount, 0);
    const savings = totalIncome - totalExpense;

    // Group by category
    const categorySpend = {};
    expenseTxns.forEach((t) => {
      const catName =
        catMap[t.categoryId]?.name || t.category || "Uncategorized";
      categorySpend[catName] = (categorySpend[catName] || 0) + t.amount;
    });

    const topCategory = Object.entries(categorySpend).sort(
      (a, b) => b[1] - a[1]
    )[0] || ["None", 0];

    // Category plan usage
    const categoryPlanUsage = {};
    if (plan && plan.data) {
      const monthPlan = plan.data;

      Object.entries(monthPlan).forEach(([catName, plannedAmount]) => {
        if (catName === "Salary" || catName === "Other Income") return;
        const spent = categorySpend[catName] || 0;
        const percentUsed =
          plannedAmount > 0 ? ((spent / plannedAmount) * 100).toFixed(1) : 0;
        categoryPlanUsage[catName] = {
          plannedAmount,
          spentAmount: spent,
          percentUsed: Number(percentUsed),
        };
      });

      // Add categories that were spent but not in plan
      for (const [catName, spent] of Object.entries(categorySpend)) {
        if (!categoryPlanUsage[catName]) {
          categoryPlanUsage[catName] = {
            plannedAmount: 0,
            spentAmount: spent,
            percentUsed: null,
          };
        }
      }
    }

    // ---- YEAR TO DATE (till selected month) ----
    const yearStart = new Date(`${currentYear}-01-01`);
    const yearEnd = new Date(`${currentYear}-12-31`);

    const yearTxns = await Transaction.find({
      userId,
      date: {
        $gte: yearStart.toISOString().split("T")[0],
        $lt: yearEnd.toISOString().split("T")[0],
      },
    });

    const monthlySpend = Array(12).fill(0);

    yearTxns.forEach((t) => {
      let categoryId = t.categoryId;
      if (!categoryId)
        categoryId = categories.find((c) => c.name === t.category)?._id;
      const type = catMap[categoryId]?.type || "Expense";
      if (type === "Expense") {
        const txnMonth = new Date(t.date).getMonth();
        if (txnMonth <= currentMonthIndex) {
          monthlySpend[txnMonth] += t.amount;
        }
      }
    });

    // Trim to show only till selected month (e.g. if November => Jan–Nov)
    const monthlySpendYTD = monthlySpend.slice(0, currentMonthIndex + 1);

    // Final response
    res.json({
      month,
      overview: {
        totalIncome,
        totalExpense,
        savings,
        topCategory: topCategory[0],
      },
      categorySpend,
      categoryPlanUsage,
      monthlySpend: monthlySpendYTD,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error generating dashboard",
      error: err.message,
    });
  }
};

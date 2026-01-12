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
        $or: [
          { paidBy: userId }, // new group-based expenses
          {
            $and: [
              // backward compatibility
              { paidBy: { $exists: false } },
              { userId: userId },
            ],
          },
        ],
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

    // ---- LAST 12 MONTHS (rolling) ----
    const endMonth = new Date(startDate); // selected month
    endMonth.setMonth(endMonth.getMonth() + 1); // exclusive end

    const startMonth = new Date(startDate);
    startMonth.setMonth(startMonth.getMonth() - 11); // go back 11 months

    const rollingTxns = await Transaction.find({
      $or: [
        { paidBy: userId },
        {
          $and: [{ paidBy: { $exists: false } }, { userId: userId }],
        },
      ],
      date: {
        $gte: startMonth.toISOString().split("T")[0],
        $lt: endMonth.toISOString().split("T")[0],
      },
    });

    const monthlySpend = Array(12).fill(0);
    const monthlyIncome = Array(12).fill(0);

    // helper to compute month index in rolling window
    const getMonthIndex = (date) => {
      const diff =
        (date.getFullYear() - startMonth.getFullYear()) * 12 +
        (date.getMonth() - startMonth.getMonth());
      return diff; // 0 → 11
    };

    rollingTxns.forEach((t) => {
      let categoryId = t.categoryId;
      if (!categoryId) {
        categoryId = categories.find((c) => c.name === t.category)?._id;
      }

      const type = catMap[categoryId]?.type || "Expense";
      const txnDate = new Date(t.date);
      const idx = getMonthIndex(txnDate);

      if (idx < 0 || idx > 11) return; // safety guard

      if (type === "Expense") {
        monthlySpend[idx] += t.amount;
      }

      if (type === "Income") {
        monthlyIncome[idx] += t.amount;
      }
    });

    const monthLabels = [];

    for (let i = 0; i < 12; i++) {
      const d = new Date(startMonth);
      d.setMonth(d.getMonth() + i);
      monthLabels.push(
        d.toLocaleString("en-US", { month: "short", year: "2-digit" })
      );
    }

    const lastMonthSpend = monthlySpend[11];
    const lastMonthIncome = monthlyIncome[11];

    // Fetch same month last year
    const prevYearStart = new Date(startMonth);
    prevYearStart.setFullYear(prevYearStart.getFullYear() - 1);

    const prevYearEnd = new Date(prevYearStart);
    prevYearEnd.setMonth(prevYearEnd.getMonth() + 1);

    const prevYearTxns = await Transaction.find({
      $or: [
        { paidBy: userId },
        {
          $and: [{ paidBy: { $exists: false } }, { userId: userId }],
        },
      ],
      date: {
        $gte: prevYearStart.toISOString().split("T")[0],
        $lt: prevYearEnd.toISOString().split("T")[0],
      },
    });

    let prevYearSpend = 0;
    let prevYearIncome = 0;

    prevYearTxns.forEach((t) => {
      let categoryId = t.categoryId;
      if (!categoryId)
        categoryId = categories.find((c) => c.name === t.category)?._id;

      const type = catMap[categoryId]?.type;

      if (type === "Expense") prevYearSpend += t.amount;
      if (type === "Income") prevYearIncome += t.amount;
    });

    const calcYoY = (current, previous) => {
      if (!previous || previous === 0) return null;
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    const yoySpendChange = calcYoY(lastMonthSpend, prevYearSpend);
    const yoyIncomeChange = calcYoY(lastMonthIncome, prevYearIncome);

    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const spendTrend =
      avg(monthlySpend.slice(9, 12)) > avg(monthlySpend.slice(6, 9))
        ? "up"
        : avg(monthlySpend.slice(9, 12)) < avg(monthlySpend.slice(6, 9))
        ? "down"
        : "flat";

    const incomeTrend =
      avg(monthlyIncome.slice(9, 12)) > avg(monthlyIncome.slice(6, 9))
        ? "up"
        : avg(monthlyIncome.slice(9, 12)) < avg(monthlyIncome.slice(6, 9))
        ? "down"
        : "flat";

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
      monthlyTrend: {
        labels: monthLabels,
        spend: monthlySpend,
        income: monthlyIncome,
        yoy: {
          spendChangePercent: yoySpendChange,
          incomeChangePercent: yoyIncomeChange,
        },
        trend: {
          spend: spendTrend,
          income: incomeTrend,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error generating dashboard",
      error: err.message,
    });
  }
};

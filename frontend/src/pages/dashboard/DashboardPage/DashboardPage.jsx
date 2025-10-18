import { useApp } from "../../../app/store";
import { SummaryCards } from "../../../components/SummaryCards";
import { NeedsWantsSavingsChart } from "../../../components/NeedsWantsSavingsChart";
import { MonthlySpendTrendChart } from "../../../components/MonthlySpendTrendChart";
import {
  filterTransactionsByMonth,
  calculateSumsByCategory,
  calculateIncomeTotal,
  calculateExpenseTotal,
  calculateSavings,
  calculateSavingsPercentage,
  calculatePieData,
  calculate503020Breakdown,
  calculateMonthlyTrend,
} from "../../../shared/lib/calculations";

export function DashboardPage() {
  const { state } = useApp();
  const { transactions, currentYear, currentMonth } = state;

  // Filter transactions by current month and year
  const filteredTransactions = filterTransactionsByMonth(
    transactions,
    currentYear,
    currentMonth,
  );

  // Calculate financial data
  const sumsByCategory = calculateSumsByCategory(filteredTransactions);
  const incomeTotal = calculateIncomeTotal(sumsByCategory);
  const expenseTotal = calculateExpenseTotal(sumsByCategory);
  const savings = calculateSavings(incomeTotal, expenseTotal);
  const savingsPct = calculateSavingsPercentage(incomeTotal, savings);

  // Calculate chart data
  const pieData = calculatePieData(sumsByCategory);
  const breakdown = calculate503020Breakdown(incomeTotal, sumsByCategory);
  const monthlyTrend = calculateMonthlyTrend(transactions);

  return (
    <div className="space-y-6">
      <SummaryCards
        incomeTotal={incomeTotal}
        expenseTotal={expenseTotal}
        savings={savings}
        savingsPct={savingsPct}
        plans={state.plans[currentYear]?.[currentMonth] || {}}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NeedsWantsSavingsChart
          pieData={pieData}
          needsBreakdown={breakdown.needs}
          wantsBreakdown={breakdown.wants}
          savingsBreakdown={breakdown.savings}
        />
        <MonthlySpendTrendChart monthlyTrend={monthlyTrend} />
      </div>
    </div>
  );
}

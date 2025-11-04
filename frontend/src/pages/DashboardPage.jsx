import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCurrentUser } from "../services/authApi";
import { useDashboard } from "../services/dashboardApi";
import { InfoTile } from "../features/dashboard/components/InfoTile";
import { CategorySpendChart } from "../features/dashboard/components/CategorySpendChart";
import { RecentTransaction } from "../features/dashboard/components/RecentTransaction";
import { MonthlySpendCard } from "../features/dashboard/components/MonthlySpendChart";
import { Link } from "react-router-dom";
import { setSelectedMonth } from "../app/store/appSlice";
import { Plus } from "lucide-react";
import { NoBackground } from "../assets/NoBackground";

export function DashboardPage() {
  const dispatch = useDispatch();
  const selectedMonth = useSelector((state) => state.app.selectedMonth);
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const { data: dashboardData, isLoading: dashboardLoading } =
    useDashboard(selectedMonth);

  const isLoading = userLoading || dashboardLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-t-2 border-b-2 border-primary-600 rounded-full animate-spin"></div>
          <span className="text-gray-600 dark:text-gray-300">
            Loading dashboard...
          </span>
        </div>
      </div>
    );
  }

  const hasData =
    dashboardData &&
    (dashboardData.overview?.totalIncome > 0 ||
      dashboardData.overview?.totalExpense > 0 ||
      Object.keys(dashboardData.categorySpend || {}).length > 0);

  return (
    <div className="min-h-screen max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="flex justify-between px-4 py-4 sm:px-0">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Hi {currentUser?.firstName} 👋
        </h2>
        <input
          name="month"
          type="month"
          className="input-field h-10 w-48"
          value={selectedMonth}
          onChange={(e) => dispatch(setSelectedMonth(e.target.value))}
        />
      </div>
      {!hasData ? (
        <p className="text-gray-600 dark:text-gray-300">
          Welcome to your budgeting dashboard. You haven’t added any
          transactions yet — start by recording your income or expenses to see
          your financial summary come alive!
        </p>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">
          Here’s a summary of your finances for {selectedMonth}.
        </p>
      )}

      {/* 👇 Dashboard Content */}
      {hasData ? (
        <>
          {/* Info Tiles */}
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4 px-4 py-3 sm:px-0">
            <InfoTile
              title="Total Income"
              amount={dashboardData?.overview?.totalIncome}
            />
            <InfoTile
              title="This Month's Spend"
              amount={dashboardData?.overview?.totalExpense}
            />
            <InfoTile
              title="Savings"
              amount={dashboardData?.overview?.savings}
              helperText={`${
                dashboardData?.overview?.totalIncome === 0
                  ? 0
                  : (
                      (dashboardData?.overview?.savings /
                        dashboardData?.overview?.totalIncome) *
                      100
                    ).toFixed(1)
              }% of income`}
            />
            <InfoTile
              title="Top Category"
              amount={dashboardData?.overview?.topCategory || "—"}
            />
          </div>

          {/* Charts & Transactions */}
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4 px-4 py-3 sm:px-0">
            <CategorySpendChart data={dashboardData?.categoryPlanUsage} />
            <MonthlySpendCard monthlySpend={dashboardData?.monthlySpend} />
            <RecentTransaction month={selectedMonth} />
          </div>
        </>
      ) : (
        /* Empty state with gentle guidance */
        <div className="card p-8 mt-8 flex flex-col">
          <NoBackground />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
            Your dashboard is waiting for data
          </h3>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Once you start adding your income and expenses, this space will show
            your budget progress, top spending categories, and insights.
          </p>
          <Link to="/transactions" className="btn-primary self-end flex gap-2">
            Explore Transactions
          </Link>
        </div>
      )}
      {/* <Link
        to="/transactions/add"
        className="fixed btn-primary bottom-8 right-8 flex items-center gap-2 font-semibold px-4 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
      >
        <Plus size={20} />
        Add Quick Transaction
      </Link> */}
    </div>
  );
}

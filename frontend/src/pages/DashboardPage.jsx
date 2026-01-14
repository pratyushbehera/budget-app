import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDashboard } from "../services/dashboardApi";
import { InfoTile } from "../features/dashboard/components/InfoTile";
import { CategorySpendChart } from "../features/dashboard/components/CategorySpendChart";
import { RecentTransaction } from "../features/dashboard/components/RecentTransaction";
import { MonthlySpendCard } from "../features/dashboard/components/MonthlySpendChart";
import { Link } from "react-router-dom";
import { setSelectedMonth } from "../app/store/appSlice";
import { motion } from "framer-motion";
import { NoBackground } from "../assets/NoBackground";
import { QuickAdd } from "../features/dashboard/components/QuickAdd";
import { LoadingPage } from "../shared/components/LoadingPage";
import ChatWidget from "../features/dashboard/components/ChatWidget";
import { PendingInviteBanner } from "../features/group/components/PendingInviteBanner";
import { usePendingRecurring } from "../services/recurringApi";
import { PendingRecurringCard } from "../features/recurring/components/PendingRecurringCard";
import { todayISO, formatMonthYear } from "../shared/utils/formatDate";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function DashboardPage() {
  const dispatch = useDispatch();
  const { user: currentUser, loading: userLoading } = useSelector(
    (state) => state.auth
  );
  const { groups } = useSelector((state) => state.group);

  const selectedMonth = useSelector((state) => state.app.selectedMonth);
  const { data: dashboardData, isLoading: dashboardLoading } =
    useDashboard(selectedMonth);
  const { data: pendingRecurring } = usePendingRecurring();
  const today = todayISO();

  const actionableRecurring =
    pendingRecurring?.filter(
      (r) => r.status === "pending" && r.dueDate <= today
    ) || [];
  // const insightHook = useInsights(selectedMonth, currentUser);

  const isLoading = userLoading || dashboardLoading;

  if (isLoading) {
    return <LoadingPage page="dashboard" />;
  }

  const hasData =
    dashboardData &&
    (dashboardData.overview?.totalIncome > 0 ||
      dashboardData.overview?.totalExpense > 0 ||
      Object.keys(dashboardData.categorySpend || {}).length > 0);

  const pendingInvites = groups?.filter((g) => {
    const member = g.members.find((m) => m.email === currentUser?.email);
    return member?.status === "pending";
  }).length;

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
      {actionableRecurring?.length > 0 && (
        <PendingRecurringCard items={actionableRecurring} />
      )}

      {pendingInvites > 0 && (
        <PendingInviteBanner pendingCount={pendingInvites} />
      )}
      {!hasData ? (
        <p className="text-gray-600 dark:text-gray-300 px-5 sm:px-0">
          Welcome to your budgeting dashboard. You haven’t added any
          transactions yet — start by recording your income or expenses to see
          your financial summary come alive!
        </p>
      ) : (
        <p className="text-gray-600 dark:text-gray-300 px-5 sm:px-0">
          Here’s a summary of your finances for {formatMonthYear(selectedMonth)}
          .
        </p>
      )}

      {/* 👇 Dashboard Content */}
      {hasData ? (
        <>
          {/* Info Tiles */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid lg:grid-cols-4 grid-cols-2 gap-4 px-4 py-3 sm:px-0"
          >
            {[
              {
                title: "Total Income",
                amount: dashboardData?.overview?.totalIncome,
              },
              {
                title: "This Month's Spend",
                amount: dashboardData?.overview?.totalExpense,
              },
              {
                title: "Savings",
                amount: dashboardData?.overview?.savings,
                helperText: `${
                  dashboardData?.overview?.totalIncome === 0
                    ? 0
                    : (
                        (dashboardData?.overview?.savings /
                          dashboardData?.overview?.totalIncome) *
                        100
                      ).toFixed(1)
                }% of income`,
              },
              {
                title: "Top Category",
                amount: dashboardData?.overview?.topCategory || "—",
              },
            ].map((tile) => (
              <motion.div key={tile.title} variants={itemVariants}>
                <InfoTile {...tile} />
              </motion.div>
            ))}
          </motion.div>

          {/* <h2 className="text-lg font-semibold mb-2">AI Insights</h2>
          <InsightsCardList
            selectedMonth={selectedMonth}
            insightHook={insightHook}
          /> */}

          {/* Charts & Transactions */}
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4 px-4 py-3 sm:px-0">
            <MonthlySpendCard monthlyTrend={dashboardData?.monthlyTrend} />
            <RecentTransaction month={selectedMonth} />

            <CategorySpendChart data={dashboardData?.categoryPlanUsage} />
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
      <QuickAdd />
      <ChatWidget categoryPlanUsage={dashboardData?.categoryPlanUsage} />
    </div>
  );
}

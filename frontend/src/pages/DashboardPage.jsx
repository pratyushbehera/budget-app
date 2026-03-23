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
import { useWeeklyInsightsQuery } from "../services/insightsApi";
import { WeeklyInsightsList } from "../features/dashboard/components/WeeklyInsightsList";
import { DateRangePicker } from "../shared/components/DateRangePicker";

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

  const { dateMode, selectedMonth, startDate, endDate } = useSelector((state) => state.app);
  const { data: dashboardData, isLoading: dashboardLoading } =
    useDashboard({ month: selectedMonth, startDate, endDate });
  const { data: pendingRecurring } = usePendingRecurring();
  const today = todayISO();

  const actionableRecurring =
    pendingRecurring?.filter(
      (r) => r.status === "pending" && r.dueDate <= today
    ) || [];

  // const weeklyInsightsQuery = useWeeklyInsightsQuery();

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
    <div className="min-h-screen max-w-7xl mx-auto sm:px-6 lg:px-8 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-6 sm:py-10 sm:px-0 gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight"
          >
            Hi {currentUser?.firstName} <span className="inline-block animate-bounce-subtle">👋</span>
          </motion.h1>
          <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 font-medium">
            {!hasData 
              ? "Welcome to FinPal. Let's start your financial journey."
              : `Here’s your financial pulse for ${dateMode === "range" ? selectedMonth : formatMonthYear(selectedMonth)}.`}
          </p>
        </div>
        <DateRangePicker />
      </header>

      {actionableRecurring?.length > 0 && (
        <div className="px-4 sm:px-0 mb-8">
          <PendingRecurringCard items={actionableRecurring} />
        </div>
      )}

      {pendingInvites > 0 && (
        <div className="px-4 sm:px-0 mb-8">
          <PendingInviteBanner pendingCount={pendingInvites} />
        </div>
      )}

      {/* 👇 Dashboard Content */}
      {hasData ? (
        <div className="space-y-6 sm:space-y-10">
          {/* Info Tiles */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid lg:grid-cols-4 grid-cols-2 gap-4 sm:gap-6 px-4 py-3 sm:px-0"
          >
            {[
              {
                title: "Income",
                amount: dashboardData?.overview?.totalIncome,
              },
              {
                title: "Spend",
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
                }%`,
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

          {/* <section className="mt-6">
            <h2 className="text-lg font-semibold mb-2">
              Weekly Spending Insights
            </h2>

            {weeklyInsightsQuery.isLoading && (
              <p className="text-sm text-gray-500">
                Analyzing your spending...
              </p>
            )}

            {weeklyInsightsQuery.data && (
              <WeeklyInsightsList insights={weeklyInsightsQuery.data.content} />
            )}
          </section> */}

          {/* Charts & Transactions */}
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4 px-4 py-3 sm:px-0">
            <MonthlySpendCard monthlyTrend={dashboardData?.monthlyTrend} />
            <RecentTransaction month={selectedMonth} startDate={startDate} endDate={endDate} />

            <CategorySpendChart data={dashboardData?.categoryPlanUsage} />
          </div>
        </div>
      ) : (
        /* Empty state with gentle guidance */
        <div className="card p-8 sm:p-12 mt-8 flex flex-col items-center text-center rounded-2xl sm:rounded-3xl md:rounded-[3rem] bg-gray-50/50 dark:bg-gray-800/30 border-none shadow-none">
          <div className="w-48 h-48 sm:w-64 sm:h-64 mb-8 grayscale opacity-50 contrast-125">
            <NoBackground />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
            Your financial story starts here
          </h3>
          <p className="mb-10 text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed font-medium">
            Once you start adding your income and expenses, this space will transform into a vibrant dashboard of your budget progress.
          </p>
          <Link to="/transactions" className="btn-primary flex items-center gap-3 text-lg px-8 sm:px-10 py-4 h-auto shadow-xl shadow-primary-500/20 active:scale-95 transition-all">
            Start Adding Transactions
          </Link>
        </div>
      )}
      <QuickAdd />
      <ChatWidget categoryPlanUsage={dashboardData?.categoryPlanUsage} />
    </div>
  );
}

import { useSelector } from "react-redux";
import { useDashboard } from "../services/dashboardApi";
import { InfoTile } from "../features/dashboard/components/InfoTile";
import { CategorySpendChart } from "../features/dashboard/components/CategorySpendChart";
import { RecentTransaction } from "../features/dashboard/components/RecentTransaction";
import { MonthlySpendCard } from "../features/dashboard/components/MonthlySpendChart";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NoBackground } from "../assets/NoBackground";
import { QuickAdd } from "../features/dashboard/components/QuickAdd";
import { LoadingPage } from "../shared/components/LoadingPage";
import ChatWidget from "../features/dashboard/components/ChatWidget";
import { PendingInviteBanner } from "../features/group/components/PendingInviteBanner";
import { usePendingRecurring } from "../services/recurringApi";
import { PendingRecurringCard } from "../features/recurring/components/PendingRecurringCard";
import { todayISO, formatMonthYear } from "../shared/utils/formatDate";
import { DateRangePicker } from "../shared/components/DateRangePicker";
import Button from "@/shared/system/Button";
import PageHeading from "@/shared/components/PageHeading";
import Typography from "@/shared/system/Typography";

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

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user: currentUser, loading: userLoading } = useSelector(
    (state) => state.auth
  );
  const { groups } = useSelector((state) => state.group);

  const { dateMode, selectedMonth, startDate, endDate } = useSelector(
    (state) => state.app
  );
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboard({
    month: selectedMonth,
    startDate,
    endDate,
  });
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
        <PageHeading
          title={`Welcome back, ${currentUser?.firstName}`}
          subtitle={
            !hasData
              ? "Welcome to FinPal. Let's start your financial journey."
              : `Here’s your financial pulse for ${
                  dateMode === "range"
                    ? selectedMonth
                    : formatMonthYear(selectedMonth)
                }.`
          }
        />

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
            <RecentTransaction
              month={selectedMonth}
              startDate={startDate}
              endDate={endDate}
            />

            <CategorySpendChart data={dashboardData?.categoryPlanUsage} />
          </div>
        </div>
      ) : (
        /* Empty state with gentle guidance */
        <div className="card  sm:p-12 flex flex-col items-center text-center rounded-2xl sm:rounded-3xl md:rounded-[3rem] bg-gray-50/50 dark:bg-gray-800/30 border shadow-none">
          <div className="w-48 h-48 sm:w-64 sm:h-64 mb-8 grayscale opacity-50 contrast-125">
            <NoBackground />
          </div>
          <Typography variant="h3">Your financial story starts here</Typography>
          <Typography variant="body1" align="center">
            Once you start adding your income and expenses, this space will
            transform into a vibrant dashboard of your budget progress.
          </Typography>
          <Button className="mt-8" onClick={() => navigate("/transactions")}>
            Start Adding Transactions
          </Button>
        </div>
      )}
      <QuickAdd />
      <ChatWidget categoryPlanUsage={dashboardData?.categoryPlanUsage} />
    </div>
  );
}

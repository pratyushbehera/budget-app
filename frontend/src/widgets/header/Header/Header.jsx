import { useApp } from "../../../app/store";
import { MonthYearSelector } from "../../../components/MonthYearSelector";
import { Button } from "../../../shared/ui";

export function Header() {
  const { state, actions } = useApp();
  const { currentMonth, currentYear, userInfo } = state;

  const handleExportCSV = () => {
    const { transactions } = state;
    const filteredTransactions = transactions.filter((t) =>
      t.date.startsWith(`${currentYear}-${currentMonth}`),
    );

    const header = ["id", "date", "category", "amount", "notes"];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.date,
      t.category,
      t.amount,
      `"${t.notes || ""}"`,
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${currentYear}-${currentMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Tracker</h1>
          {userInfo && (
            <p className="text-sm text-gray-600 mt-1">
              Welcome back, {userInfo.name || userInfo.email}!
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <MonthYearSelector
            currentMonth={currentMonth}
            setCurrentMonth={actions.setCurrentMonth}
            currentYear={currentYear}
            setCurrentYear={actions.setCurrentYear}
          />

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              Export CSV
            </Button>

            <Button variant="danger" size="sm" onClick={actions.logoutUser}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

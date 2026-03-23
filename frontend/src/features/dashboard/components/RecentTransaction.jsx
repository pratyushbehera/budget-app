import { Link } from "react-router-dom";
import { useTransaction } from "../../../services/transactionApi";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { categoryIconMap } from "../../../shared/utils/categoryIconMap";

export function RecentTransaction({ month }) {
  const { data, isLoading, error } = useTransaction({ month, limit: 5 });

  if (isLoading) return <p>Loading recent transactions...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="md:col-span-2 col-span-4 rounded-3xl bg-white dark:bg-gray-800/50 p-6 shadow-md border-none backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
          Recent Transactions
        </h3>
        <Link
          to="/transactions"
          className="text-sm font-bold text-primary-500 hover:text-primary-600 transition-colors uppercase tracking-wider"
        >
          View All
        </Link>
      </div>

      {!data?.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
          <Wallet className="w-12 h-12 mb-3 opacity-20" />
          <p className="text-sm font-medium">No transactions yet</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {data.map((tx) => {
            const isIncome =
              tx.type?.toLowerCase() === "income" ||
              ["salary", "bonus", "interest", "other income", "dividend"].includes(
                tx.category.toLowerCase()
              );

            const Icon = categoryIconMap[tx.category.toLowerCase()] || Wallet;

            return (
              <li
                key={tx._id}
                className="group flex items-center justify-between p-3 bg-white dark:bg-gray-800/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100/50 dark:border-gray-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                      {tx.category}
                    </p>
                    <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
                      {new Date(tx.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center text-base font-bold tracking-tight ${isIncome
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                    }`}
                >
                  <span className="mr-1">{isIncome ? "+" : "-"}</span>
                  {formatCurrency(tx.amount)}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

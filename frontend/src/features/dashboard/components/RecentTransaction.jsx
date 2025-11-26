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
    <div className="card p-4 md:col-span-2 col-span-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Recent Transactions
        </h3>
        <Link
          to="/transactions"
          className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
        >
          View All →
        </Link>
      </div>

      {!data?.length ? (
        <div className="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-gray-500">
          <Wallet className="w-8 h-8 mb-2" />
          <p className="text-sm">No transactions yet</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {data.map((tx) => {
            const isIncome =
              tx.type?.toLowerCase() === "income" ||
              ["salary", "bonus", "interest", "other income","dividend"].includes(
                tx.category.toLowerCase()
              );

            const Icon = categoryIconMap[tx.category.toLowerCase()] || Wallet;

            return (
              <li
                key={tx._id}
                className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {tx.category}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(tx.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center text-sm font-semibold ${
                    isIncome
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {isIncome ? (
                    <ArrowUpRight size={16} className="mr-1" />
                  ) : (
                    <ArrowDownRight size={16} className="mr-1" />
                  )}
                  {isIncome ? "+" : "-"}
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

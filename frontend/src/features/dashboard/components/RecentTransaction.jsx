import { Link } from "react-router-dom";
import { useTransaction } from "../../../services/transactionApi";
import { formatCurrency } from "../../../shared/utils/formatCurrency";

export function RecentTransaction({ month }) {
  const { data, isLoading, error } = useTransaction({ month, limit: 5 });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="card p-4 col-span-2">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Recent Transactions
      </h3>

      <div className="overflow-x-auto overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-100 dark:bg-gray-50 text-gray-700 dark:text-gray-800 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Date</th>
              <th className="px-4 py-2 text-left font-medium">Category</th>
              <th className="px-4 py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data?.map((tx) => {
              const isIncome =
                tx.type?.toLowerCase() === "income" ||
                ["salary", "bonus", "interest", "other income"].includes(
                  tx.category.toLowerCase()
                );

              return (
                <tr
                  key={tx._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                    {new Date(tx.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </td>

                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isIncome
                          ? "border border-green-100 text-green-700 dark:border-green-800 dark:text-green-300"
                          : "border border-red-100 text-red-700 dark:border-red-800 dark:text-red-300"
                      }`}
                    >
                      {tx.category}
                    </span>
                  </td>

                  <td
                    className={`px-4 py-2 text-right font-medium ${
                      isIncome
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="text-right mt-2">
        <Link
          to="/transactions"
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          View all →
        </Link>
      </div>
    </div>
  );
}

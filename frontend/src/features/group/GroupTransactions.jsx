import React from "react";
import { useGroupTransactions } from "../../services/groupApi";

const GroupTransactions = ({ groupId }) => {
  const { data: transactions, isLoading } = useGroupTransactions(groupId);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border dark:border-gray-800">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Group Transactions
        </h2>
      </div>

      <hr className="my-4 border-gray-300 dark:border-gray-700" />

      {/* LIST */}
      {isLoading ? (
        <div className="text-gray-500">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="text-gray-500">No transactions yet</div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx._id}
              className="p-3 rounded bg-gray-50 dark:bg-gray-800 flex justify-between"
            >
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-200">
                  ₹{tx.amount}
                </p>
                <p className="text-sm text-gray-500">{tx.notes}</p>
              </div>

              <p className="text-xs text-gray-500">
                {new Date(tx.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupTransactions;

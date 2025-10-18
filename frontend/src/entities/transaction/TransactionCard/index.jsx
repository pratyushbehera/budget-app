import { Button } from "../../../shared/ui";

export function TransactionCard({ transaction, onDelete, onEdit }) {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAmountColor = (amount) => {
    return amount >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">
              {transaction.category}
            </h3>
            <span
              className={`font-semibold ${getAmountColor(transaction.amount)}`}
            >
              {formatAmount(transaction.amount)}
            </span>
          </div>

          <div className="text-sm text-gray-600 mb-2">
            {formatDate(transaction.date)}
          </div>

          {transaction.notes && (
            <p className="text-sm text-gray-700">{transaction.notes}</p>
          )}
        </div>

        <div className="flex space-x-2 ml-4">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(transaction)}
            >
              Edit
            </Button>
          )}

          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(transaction.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

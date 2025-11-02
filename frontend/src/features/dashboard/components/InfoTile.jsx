import { formatCurrency } from "../../../shared/utils/formatCurrency";

export const InfoTile = ({ title, amount, helperText }) => {
  return (
    <div className="card p-4">
      <h3 className="text-sm text-gray-900 dark:text-white">{title}</h3>
      <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">
        {formatCurrency(amount)}
      </p>
      <div className="text-xs text-gray-400">{helperText}</div>
    </div>
  );
};

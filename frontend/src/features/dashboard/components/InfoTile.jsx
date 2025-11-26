import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { Wallet, TrendingUp, PiggyBank, ListChecks } from "lucide-react";

const gradientMap = {
  "Total Income": "from-emerald-400 to-teal-500",
  "This Month's Spend": "from-rose-400 to-red-500",
  Savings: "from-indigo-400 to-blue-500",
  "Top Category": "from-amber-400 to-orange-500",
};

const iconMap = {
  "Total Income": Wallet,
  "This Month's Spend": TrendingUp,
  Savings: PiggyBank,
  "Top Category": ListChecks,
};

export const InfoTile = ({ title, amount, helperText }) => {
  const gradient = gradientMap[title] || "from-gray-200 to-gray-300";
  const Icon = iconMap[title] || Wallet;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl md:min-h-[112px] p-4 text-white shadow-lg bg-gradient-to-r ${gradient}`}
    >
      {/* Background Glyph */}
      <Icon
        className="absolute -right-2 -bottom-2 w-20 h-20 opacity-15 text-white pointer-events-none"
        strokeWidth={1.5}
      />

      <h3 className="text-sm font-medium">{title}</h3>
      <p className="md:text-3xl text-xl font-bold mt-1">
        {formatCurrency(amount)}
      </p>
      {helperText && (
        <div className="text-xs mt-1 opacity-80">{helperText}</div>
      )}
    </div>
  );
};

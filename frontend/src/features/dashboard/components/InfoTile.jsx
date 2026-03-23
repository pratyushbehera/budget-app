import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { Wallet, TrendingUp, PiggyBank, ListChecks } from "lucide-react";

const gradientMap = {
  "Income": "from-emerald-500 to-emerald-600",
  "Spend": "from-rose-500 to-rose-600",
  Savings: "from-violet-500 to-violet-600",
  "Top Category": "from-amber-500 to-orange-600",
};

const iconMap = {
  "Total Income": Wallet,
  "This Month's Spend": TrendingUp,
  Savings: PiggyBank,
  "Top Category": ListChecks,
};

export const InfoTile = ({ title, amount, helperText }) => {
  const gradient = gradientMap[title] || "from-gray-400 to-gray-500";
  const Icon = iconMap[title] || Wallet;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl md:min-h-[128px] p-4 sm:p-6 text-white shadow-xl bg-gradient-to-br ${gradient} hover:scale-[1.02] transition-transform duration-300`}
    >
      {/* Background Glyph */}
      <Icon
        className="absolute -right-2 -bottom-2 w-16 h-16 sm:w-24 sm:h-24 opacity-20 text-white pointer-events-none rotate-12"
        strokeWidth={1}
      />

      <h3 className="text-sm font-semibold uppercase tracking-wider opacity-90">{title}</h3>
      <p className="md:text-4xl text-2xl font-bold mt-2 tracking-tight">
        {formatCurrency(amount)}
      </p>
      {helperText && (
        <div className="text-xs mt-2 font-medium bg-white/20 backdrop-blur-md px-2 py-1 rounded-full w-fit">
          {helperText}
        </div>
      )}
    </div>
  );
};

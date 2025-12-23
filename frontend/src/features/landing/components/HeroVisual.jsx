import { motion } from "framer-motion";
import { IndianRupee, TrendingUp, Wallet } from "lucide-react";

export function HeroVisual() {
  return (
    <div className="relative w-full h-[420px] flex items-center justify-center">
      {/* Floating Card 1 */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-10 top-24 glass-card p-5 rounded-2xl shadow-xl"
      >
        <IndianRupee className="text-primary-600 mb-2" />
        <p className="font-semibold">Monthly Spend</p>
        <p className="text-2xl font-bold">₹32,450</p>
      </motion.div>

      {/* Center Card */}
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="glass-card p-6 rounded-3xl shadow-2xl"
      >
        <Wallet className="text-primary-600 mb-3" />
        <p className="font-semibold mb-1">Budget Used</p>
        <div className="h-2 w-48 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-primary-600 rounded-full" />
        </div>
      </motion.div>

      {/* Floating Card 2 */}
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-10 bottom-24 glass-card p-5 rounded-2xl shadow-xl"
      >
        <TrendingUp className="text-green-500 mb-2 z-10" />
        <p className="font-semibold">Savings ↑</p>
        <p className="text-2xl font-bold">+18%</p>
      </motion.div>
    </div>
  );
}

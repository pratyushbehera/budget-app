import { motion } from "framer-motion";
import { IndianRupee, TrendingUp, Wallet } from "lucide-react";

export function HeroVisual() {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-primary-500/5 rounded-full blur-[100px] animate-pulse"></div>

      {/* Floating Card 1: Monthly Spend */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0, y: [0, -30, 0] }}
        transition={{
          opacity: { duration: 1 },
          x: { duration: 1 },
          y: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute left-0 top-12 bg-white/60 dark:bg-gray-900/40 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-gray-800/50 z-20 hover:scale-110 transition-transform cursor-pointer group"
      >
        <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20 rotate-3 group-hover:rotate-12 transition-transform">
          <IndianRupee className="text-white" size={24} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Monthly Flow</p>
        <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">₹32,450</p>
      </motion.div>

      {/* Center Card: Main Budget */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, y: [0, 20, 0] }}
        transition={{
          scale: { duration: 1 },
          opacity: { duration: 1 },
          y: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }}
        className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-3xl p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white dark:border-gray-800/50 relative z-10"
      >
        <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary-500/30">
          <Wallet className="text-white" size={32} />
        </div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter mb-4">Core Budget</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-end mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-500">Utilization</span>
            <span className="text-sm font-black text-gray-900 dark:text-white">65%</span>
          </div>
          <div className="h-4 w-60 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-1 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              transition={{ duration: 2, delay: 1 }}
              className="h-full bg-primary-500 rounded-full shadow-lg shadow-primary-500/50"
            />
          </div>
        </div>
      </motion.div>

      {/* Floating Card 2: Savings Graph */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0, y: [0, -25, 0] }}
        transition={{
          opacity: { duration: 1, delay: 0.2 },
          x: { duration: 1, delay: 0.2 },
          y: { duration: 7, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute right-0 bottom-12 bg-emerald-500/10 dark:bg-emerald-500/5 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-2xl border border-emerald-100/50 dark:border-emerald-500/20 hover:scale-110 transition-transform cursor-pointer group"
      >
        <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20 -rotate-3 group-hover:-rotate-12 transition-transform">
          <TrendingUp className="text-white" size={24} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-1">Growth</p>
        <div className="flex items-baseline gap-1">
          <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">+18%</p>
          <span className="text-xs font-bold text-emerald-500/60 transition-transform group-hover:translate-x-1">→</span>
        </div>
      </motion.div>
    </div>
  );
}

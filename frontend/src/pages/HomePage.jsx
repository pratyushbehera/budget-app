import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Goal, IndianRupee, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export function HomePage() {
  const { theme } = useTheme();

  const features = [
    {
      icon: <IndianRupee size={64} className="absolute opacity-15" />,
      title: "Expense Tracking",
      desc: "Monitor your spending habits and categorize expenses for better insights.",
      gradient: "from-pink-500 to-rose-400",
    },
    {
      icon: <Wallet size={64} className="absolute opacity-15" />,
      title: "Budget Planning",
      desc: "Set monthly budgets and get alerts when you're approaching your limits.",
      gradient: "from-indigo-500 to-blue-400",
    },
    {
      icon: <Goal size={64} className="absolute opacity-15" />,
      title: "Goal Setting",
      desc: "Define financial goals and track your progress towards achieving them.",
      gradient: "from-emerald-500 to-green-400",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-950 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 items-center h-16">
          <img
            src="/logo.png"
            alt="FinPal Logo"
            className="w-7 h-7 object-contain"
          />
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            FinPal
          </h1>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-primary-50 to-gray-100 dark:from-gray-950 dark:to-gray-800 py-5">
        <div className="text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Take Control of Your
              <span className="text-primary-600 dark:text-primary-400 block">
                Finances
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Track your expenses, set budgets, and achieve your financial goals
              with our intuitive budget tracking application.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-row gap-4 justify-center items-center mb-12"
            >
              <Link
                to="/signup"
                className="btn-primary text-lg px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Signup
              </Link>
              <Link
                to="/login"
                className="btn-secondary text-lg px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              >
                Login
              </Link>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.2 },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 mx-8 md:mx-12 md:mt-12"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className={`relative card p-6 text-left transition-all duration-300 rounded-2xl overflow-hidden bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}
              >
                <div className="absolute inset-0 flex items-center justify-end mr-10">
                  {feature.icon}
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="opacity-90">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            &copy; 2025 FinPal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

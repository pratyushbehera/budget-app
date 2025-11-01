import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

export function HomePage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-950 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                FinPal
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/signup" className="btn-primary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-primary-50 to-gray-100 dark:from-gray-950 dark:to-gray-800 pt-5">
        <div className="text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              Take Control of Your
              <span className="text-primary-600 dark:text-primary-400 block">
                Finances
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Track your expenses, set budgets, and achieve your financial goals
              with our intuitive budget tracking application.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/signup"
                className="btn-primary text-lg px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="btn-secondary text-lg px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              >
                Existing User
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="card p-6 text-left hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Expense Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Monitor your spending habits and categorize expenses for
                  better insights.
                </p>
              </div>

              <div className="card p-6 text-left hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Budget Planning
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Set monthly budgets and get alerts when you're approaching
                  your limits.
                </p>
              </div>

              <div className="card p-6 text-left hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Goal Setting
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Define financial goals and track your progress towards
                  achieving them.
                </p>
              </div>
            </div>
          </div>
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

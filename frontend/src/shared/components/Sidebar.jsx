import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNotification } from "../../contexts/NotificationContext";
import { logout } from "../../features/auth/authSlice";
import { ThemeToggle } from "../../features/dashboard/components/ThemeToggle";
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Wallet,
  Bell,
  Share2,
  FolderTree,
  Users,
  Trophy,
  Menu,
  X,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useGravatar } from "../hooks/useGravatar";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const { user } = useSelector((state) => state.auth);

  const { avatarUrl, loading, error } = useGravatar(user?.email, {
    size: 100,
    checkExistence: true,
  });

  const handleLogout = () => {
    dispatch(logout());
    addNotification({
      type: "success",
      title: "Logged Out",
      message: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      {!isOpen && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={toggleSidebar}
            className="p-2 border rounded-md bg-gray-200 dark:bg-gray-950 text-gray-800 dark:text-gray-200"
          >
            <Menu size={20} />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="FinPal Logo"
                className="w-7 h-7 object-contain"
              />
              <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                FinPal
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <button
                onClick={toggleSidebar}
                className="md:hidden p-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 text-gray-700 dark:text-gray-300">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <LayoutDashboard size={18} /> Overview
            </Link>
            <Link
              to="/transactions"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <CreditCard size={18} /> Transactions
            </Link>
            <Link
              to="/plan"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <FileText size={18} /> Plan
            </Link>

            <div className="pt-4 border-t dark:border-gray-700">
              <p className="text-xs uppercase text-gray-400 mb-2">
                Stocks & Mutual funds
              </p>
              <Link
                to="/portfolio"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Wallet size={18} /> My Portfolio
              </Link>
            </div>

            <div className="pt-4 border-t dark:border-gray-700">
              <p className="text-xs uppercase text-gray-400 mb-2">Group</p>
              <Link
                to="/shared"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Share2 size={18} /> Shared Access
              </Link>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t dark:border-gray-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 w-full">
              {error || !avatarUrl || loading ? (
                <UserIcon
                  size={18}
                  className="text-primary-600 dark:text-primary-400"
                />
              ) : (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="rounded-full w-8"
                />
              )}

              <Link
                to="/profile"
                className="text-sm w-32 font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 overflow-hidden whitespace-nowrap text-ellipsis"
              >
                {user?.firstName}
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-30"
        />
      )}
    </>
  );
};

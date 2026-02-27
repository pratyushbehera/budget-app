import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../contexts/ToastContext";
import { logout } from "../../features/auth/authSlice";
import { NotificationPopover } from "../../features/notifications/components/NotificationPopover";
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  TicketCheck,
  Group,
} from "lucide-react";
import { useGravatar } from "../hooks/useGravatar";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { groups, loading: isGroupLoading } = useSelector(
    (state) => state.group
  );

  const { avatarUrl, loading, error } = useGravatar(user?.email, {
    size: 100,
    checkExistence: true,
  });

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("auth-token");
    addToast({
      type: "success",
      title: "Logged Out",
      message: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const acceptedGroups = groups?.filter((grp) => {
    const member = grp.members?.find((m) => m.userId === user?._id);
    return member && member.status !== "pending";
  });

  return (
    <>
      {/* Mobile Toggle Button */}
      {!isOpen && (
        <div className="md:hidden fixed flex space-x-2 w-full  z-50 bg-white dark:bg-gray-950 border pl-4 py-4">
          <button
            onClick={toggleSidebar}
            aria-label="Open menu"
            className="p-2 border top-4 left-4 rounded-md bg-gray-200 dark:bg-gray-300 text-gray-800 dark:text-white"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="FinPal Logo"
              className="w-7 h-7 object-contain"
            />
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
              FinPal
            </h1>
            <NotificationPopover />
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        role="navigation"
        aria-label="Main Sidebar"
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
              <div className="hidden md:block">
                <NotificationPopover />
              </div>
              <button
                onClick={toggleSidebar}
                aria-label="Close menu"
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
              onClick={toggleSidebar}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <LayoutDashboard size={18} /> Overview
            </Link>
            <Link
              to="/transactions"
              onClick={toggleSidebar}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <CreditCard size={18} /> Transactions
            </Link>
            <Link
              to="/plan"
              onClick={toggleSidebar}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <FileText size={18} /> Plan
            </Link>
            <Link
              to="/groups"
              onClick={toggleSidebar}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Group size={18} /> Groups
            </Link>

            {/* <div className="pt-4 border-t dark:border-gray-700">
              <p className="text-xs uppercase text-gray-400 mb-2">
                Stocks & Mutual funds
              </p>
              <Link
                to="/portfolio"
                onClick={toggleSidebar}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Wallet size={18} /> My Portfolio
              </Link>
            </div>*/}

            {!isGroupLoading && acceptedGroups?.length > 0 && (
              <div className="pt-4 border-t dark:border-gray-700">
                <p className="text-xs uppercase text-gray-400 mb-2">Group</p>
                {acceptedGroups?.map((grp) => (
                  <Link
                    key={grp?._id}
                    to={`/groups/${grp?._id}`}
                    onClick={toggleSidebar}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <TicketCheck size={18} /> {grp.name}
                  </Link>
                ))}
              </div>
            )}
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
              aria-label="Logout"
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

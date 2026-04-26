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
        <div className="md:hidden z-50 fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={toggleSidebar}
            aria-label="Open menu"
            className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-white active:scale-95 dark:border dark:border-gray-100 transition-transform"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="FinPal Logo"
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-2xl font-black text-primary-500 tracking-tighter">
              FinPal
            </h1>
          </div>
          <NotificationPopover />
        </div>
      )}

      {/* Sidebar */}
      <aside
        role="navigation"
        aria-label="Main Sidebar"
        className={`fixed top-0 left-0 z-40 h-full w-72 bg-white dark:bg-gray-950 border-r-0 md:border-r border-gray-100 dark:border-gray-800 shadow-2xl md:shadow-none transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500 rounded-2xl shadow-lg shadow-primary-500/20">
                <img
                  src="/logo.png"
                  alt="FinPal Logo"
                  className="w-7 h-7 object-contain brightness-0 invert"
                />
              </div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                FinPal
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <NotificationPopover />
              </div>
              <button
                onClick={toggleSidebar}
                aria-label="Close menu"
                className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto space-y-2 py-2">
            {[
              { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
              { to: "/transactions", icon: CreditCard, label: "Transactions" },
              { to: "/plan", icon: FileText, label: "Budget Plan" },
              { to: "/groups", icon: Group, label: "Social Groups" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={toggleSidebar}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group
                  ${
                    window.location.pathname === item.to
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
                      : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                <item.icon
                  size={22}
                  className={`transition-transform duration-300 group-hover:scale-110 ${
                    window.location.pathname === item.to
                      ? "text-white"
                      : "text-gray-400 group-hover:text-primary-500"
                  }`}
                />
                <span className="tracking-tight">{item.label}</span>
              </Link>
            ))}

            {/* Groups Section */}
            {!isGroupLoading && acceptedGroups?.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                <p className="px-4 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
                  Your Groups
                </p>
                <div className="space-y-1">
                  {acceptedGroups?.map((grp) => (
                    <Link
                      key={grp?._id}
                      to={`/groups/${grp?._id}`}
                      onClick={toggleSidebar}
                      className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all group
                        ${
                          window.location.pathname.includes(grp?._id)
                            ? "bg-secondary-500 text-white shadow-lg shadow-secondary-500/20"
                            : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      <TicketCheck
                        size={20}
                        className={`${
                          window.location.pathname.includes(grp?._id)
                            ? "text-white"
                            : "text-gray-400 group-hover:text-secondary-500"
                        }`}
                      />
                      <span className="text-sm truncate tracking-tight">
                        {grp.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Footer Card */}
          <div className="mt-auto pt-6">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-4 border border-gray-100/50 dark:border-gray-800/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  {error || !avatarUrl || loading ? (
                    <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <UserIcon
                        size={24}
                        className="text-primary-600 dark:text-primary-400"
                      />
                    </div>
                  ) : (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-12 h-12 rounded-2xl object-cover shadow-md"
                    />
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full shadow-sm"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900 dark:text-white truncate tracking-tight">
                    {user?.firstName}
                  </p>
                  <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 truncate opacity-70">
                    Active Session
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/profile"
                  className="flex items-center justify-center p-2.5 rounded-xl bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors shadow-sm"
                >
                  <UserIcon size={18} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center p-2.5 rounded-xl bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-rose-500 transition-colors shadow-sm"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-30 transition-opacity duration-300"
        />
      )}
    </>
  );
};

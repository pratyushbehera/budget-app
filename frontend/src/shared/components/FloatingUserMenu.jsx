import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon, Bell, Sun, Moon } from "lucide-react";

import { logout } from "../../features/auth/authSlice";
import { useToast } from "../../contexts/ToastContext";
import { useGravatar } from "../hooks/useGravatar";

import { NotificationPopover } from "../../features/notifications/components/NotificationPopover";
import { ThemeToggle } from "../../features/dashboard/components/ThemeToggle";


export const FloatingUserMenu = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const menuRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { user } = useSelector((state) => state.auth);

  const { avatarUrl, loading, error } = useGravatar(user?.email, {
    size: 100,
    checkExistence: true,
  });

  /*
   * Close profile popover when clicking outside.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
   * Close profile popover with Escape.
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);

    dispatch(logout());
    localStorage.removeItem("auth-token");

    addToast({
      type: "success",
      title: "Logged Out",
      message: "You have been successfully logged out.",
    });

    navigate("/");
  };

  const handleProfile = () => {
    setIsProfileOpen(false);
    navigate("/profile");
  };

  const renderAvatar = () => {
    if (error || !avatarUrl || loading) {
      return (
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-primary-100
            dark:bg-primary-900/40
            text-primary-600
            dark:text-primary-400
          "
        >
          <UserIcon size={19} />
        </div>
      );
    }

    return (
      <img
        src={avatarUrl}
        alt="Profile"
        className="h-10 w-10 rounded-full object-cover"
      />
    );
  };

  return (
    <div
      ref={menuRef}
      className="
        fixed
        right-4
        top-4
        z-[60]
        sm:right-6
        sm:top-6
      "
    >
      {/* Floating pill */}
      <div
        className="
          flex
          items-center
          gap-1.5
          rounded-full
          border
          border-gray-200/80
          bg-white/85
          p-1.5
          shadow-lg
          shadow-gray-900/5
          backdrop-blur-xl
          dark:border-gray-800/80
          dark:bg-gray-900/85
          dark:shadow-black/20
        "
      >
        {/* Notifications */}
        <div className="flex items-center">
          <NotificationPopover />
        </div>

        {/* Theme */}
        <ThemeToggle />

        {/* Divider */}
        <div className="mx-1 h-7 w-px bg-gray-200 dark:bg-gray-700" />

        {/* Profile */}
        <button
          type="button"
          aria-label="Open profile menu"
          aria-expanded={isProfileOpen}
          onClick={() => setIsProfileOpen((value) => !value)}
          className="
            rounded-full
            transition
            hover:ring-2
            hover:ring-primary-500/30
            focus:outline-none
            focus:ring-2
            focus:ring-primary-500/40
          "
        >
          {renderAvatar()}
        </button>
      </div>

      {/* Profile popover */}
      {isProfileOpen && (
        <div
          className="
            absolute
            right-0
            top-[calc(100%+0.75rem)]
            w-64
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-2xl
            shadow-gray-900/10
            dark:border-gray-800
            dark:bg-gray-900
            dark:shadow-black/30
          "
        >
          {/* User information */}
          <div
            className="
              border-b
              border-gray-100
              px-4
              py-4
              dark:border-gray-800
            "
          >
            <div className="flex items-center gap-3">
              {renderAvatar()}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-gray-900 dark:text-white">
                  {user?.firstName}
                  {user?.lastName ? ` ${user.lastName}` : ""}
                </p>

                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            <button
              type="button"
              onClick={handleProfile}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-3
                text-sm
                font-bold
                text-gray-600
                transition-colors
                hover:bg-gray-100
                hover:text-gray-900
                dark:text-gray-300
                dark:hover:bg-gray-800
                dark:hover:text-white
              "
            >
              <UserIcon size={18} />

              <span>Profile</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-3
                text-sm
                font-bold
                text-gray-600
                transition-colors
                hover:bg-rose-50
                hover:text-rose-600
                dark:text-gray-300
                dark:hover:bg-rose-950/30
                dark:hover:text-rose-400
              "
            >
              <LogOut size={18} />

              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

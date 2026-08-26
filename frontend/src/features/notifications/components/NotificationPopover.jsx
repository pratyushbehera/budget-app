import { useRef, useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { format } from "date-fns";

import {
  useNotifications,
  useMarkRead,
  useMarkAllRead,
} from "../../../services/notificationApi";

import Button from "@/shared/system/Button";
import Typography from "@/shared/system/Typography";

export const NotificationPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  const { data: notifications = [], isLoading } = useNotifications();
  const { mutate: markRead } = useMarkRead();
  const { mutate: markAllRead } = useMarkAllRead();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close when clicking outside the notification component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close with Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleMarkRead = (id, e) => {
    e.stopPropagation();
    markRead(id);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Reminder":
        return "bg-amber-200 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";

      case "Insight":
        return "bg-purple-200 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300";

      case "Group":
        return "bg-blue-200 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";

      default:
        return "bg-gray-200 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300";
    }
  };

  return (
    <div ref={popoverRef} className="relative">
      {/* Notification button */}
      <Button
        onClick={() => setIsOpen((open) => !open)}
        size="icon-sm"
        variant="ghost"
        className="relative rounded-full"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-full
              border-2
              border-white
              bg-primary-500
              text-[10px]
              font-black
              text-white
              shadow-[0_0_10px_rgba(59,130,246,0.5)]
              dark:border-gray-900
            "
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Popover */}
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="
              fixed
              inset-0
              z-40
              md:hidden
            "
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            className="
    absolute
    right-0
    top-[calc(100%+0.75rem)]
    z-50

    w-[20rem]
    max-w-[calc(100vw-2rem)]

    overflow-hidden
    rounded-[1.5rem]
    border
    border-gray-100
    bg-white
    shadow-[0_20px_50px_rgba(0,0,0,0.12)]
    backdrop-blur-2xl

    dark:border-white/10
    dark:bg-gray-950
    dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)]

    sm:w-[22rem]
    md:w-[24rem]
  "
          >
            {/* Header */}
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-gray-100/50
                px-6
                py-5
                dark:border-white/5
              "
            >
              <Typography variant="h4" role="heading">
                Notifications
              </Typography>

              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="border uppercase tracking-widest hover:text-primary-500"
                  rightIcon={<Check size={16} strokeWidth={2} />}
                  onClick={() => markAllRead()}
                >
                  Read All
                </Button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[480px] overflow-y-auto no-scrollbar">
              {isLoading ? (
                <div className="p-10 text-center text-gray-500 font-bold animate-pulse">
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-50 dark:bg-gray-900">
                    <Bell size={24} className="text-gray-300" />
                  </div>

                  <Typography variant="body1" align="center">
                    All caught up! 🎉
                  </Typography>
                </div>
              ) : (
                <ul className="space-y-1 p-2">
                  {notifications.map((n) => (
                    <li
                      key={n._id}
                      className={`
                        group
                        relative
                        rounded-2xl
                        p-4
                        transition-all
                        duration-300
                        hover:bg-gray-200
                        dark:hover:bg-white/5
                        ${
                          !n.isRead
                            ? "bg-primary-50/50 dark:bg-primary-900/10"
                            : ""
                        }
                      `}
                    >
                      <div className="flex gap-4">
                        <div
                          className={`
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            ${getTypeColor(n.type)}
                          `}
                        >
                          <Typography variant="body1">{n.type[0]}</Typography>
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <Typography variant="body1">{n.title}</Typography>

                          <Typography variant="subtitle2">
                            {n.message}
                          </Typography>

                          <Typography
                            variant="caption"
                            className="uppercase tracking-tighter"
                          >
                            {format(new Date(n.createdAt), "MMM d, h:mm a")}
                          </Typography>
                        </div>

                        {!n.isRead && (
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="shrink-0 border hover:text-primary-500"
                            leftIcon={<Check size={16} strokeWidth={2} />}
                            aria-label="Mark as read"
                            onClick={(e) => handleMarkRead(n._id, e)}
                          />
                        )}

                        {!n.isRead && (
                          <div
                            className="
                              absolute
                              right-4
                              top-4
                              h-2
                              w-2
                              rounded-full
                              bg-primary-500
                              shadow-[0_0_10px_rgba(59,130,246,0.5)]
                              group-hover:hidden
                            "
                          />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

import React, { useRef, useState, useEffect } from "react";
import { Bell, Check, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import {
    useNotifications,
    useMarkRead,
    useMarkAllRead,
} from "../../../services/notificationApi";

export const NotificationPopover = () => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef(null);

    const { data: notifications = [], isLoading } = useNotifications();
    const { mutate: markRead } = useMarkRead();
    const { mutate: markAllRead } = useMarkAllRead();

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    // Click outside listener
    useEffect(() => {
        function handleClickOutside(event) {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkRead = (id, e) => {
        e.stopPropagation();
        markRead(id);
    };

    const getTypeColor = (type) => {
        switch (type) {
            case "Reminder":
                return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "Insight":
                return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
            case "Group":
                return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
            default:
                return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    return (
        <div className="relative" ref={popoverRef}>
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Popover Content */}
            {isOpen && (
                <>
                    {/* Backdrop for mobile to close on click outside more reliably */}
                    <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsOpen(false)}></div>
                    <div className="fixed z-50 w-[90vw] md:w-96 right-auto left-1/2 -translate-x-1/2 top-20 md:translate-x-0 md:left-[17rem] md:top-4 bg-white dark:bg-gray-950 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ring-1 ring-black ring-opacity-5">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllRead()}
                                    className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium flex items-center gap-1"
                                >
                                    Mark all read <Check size={14} />
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {isLoading ? (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                    Loading...
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    <p className="text-sm">No notifications yet 🎉</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {notifications.map((n) => (
                                        <li
                                            key={n._id}
                                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${!n.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="mt-1">
                                                    <span
                                                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${getTypeColor(
                                                            n.type
                                                        )}`}
                                                    >
                                                        {n.type[0]}
                                                    </span>
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {n.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                                        {n.message}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 pt-1">
                                                        {format(new Date(n.createdAt), "MMM d, h:mm a")}
                                                    </p>
                                                </div>
                                                {!n.isRead && (
                                                    <button
                                                        onClick={(e) => handleMarkRead(n._id, e)}
                                                        className="text-primary-600 hover:text-primary-700 h-fit"
                                                        title="Mark as read"
                                                    >
                                                        <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                                                    </button>
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

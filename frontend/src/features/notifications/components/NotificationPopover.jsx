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
                return "bg-amber-100/50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
            case "Insight":
                return "bg-purple-100/50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";
            case "Group":
                return "bg-blue-100/50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
            default:
                return "bg-gray-100/50 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300";
        }
    };

    return (
        <div className="relative" ref={popoverRef}>
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative p-2.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Notifications"
            >
                <Bell size={22} className="group-hover:rotate-12 transition-transform duration-300" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-[10px] font-black text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] border-2 border-white dark:border-gray-950 animate-bounce">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Popover Content */}
            {isOpen && (
                <>
                    {/* Backdrop for mobile to close on click outside more reliably */}
                    <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsOpen(false)}></div>
                    <div className="fixed z-50 w-[95vw] md:w-[28rem] right-auto left-1/2 -translate-x-1/2 top-20 md:translate-x-0 md:left-[17rem] md:top-4 bg-white/90 dark:bg-gray-950/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/10 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100/50 dark:border-white/5">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllRead()}
                                    className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                                >
                                    Clear All <Check size={14} strokeWidth={3} />
                                </button>
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
                                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                        <Bell size={24} className="text-gray-300" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400">All caught up! 🎉</p>
                                </div>
                            ) : (
                                <ul className="p-2 space-y-1">
                                    {notifications.map((n) => (
                                        <li
                                            key={n._id}
                                            className={`group relative p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 ${!n.isRead ? "bg-primary-50/50 dark:bg-primary-900/10" : ""
                                                }`}
                                        >
                                            <div className="flex gap-4">
                                                <div className="mt-1">
                                                    <span
                                                        className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-black shadow-sm ${getTypeColor(
                                                            n.type
                                                        )}`}
                                                    >
                                                        {n.type[0]}
                                                    </span>
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                        {n.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                                        {n.message}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter pt-1 opacity-60">
                                                        {format(new Date(n.createdAt), "MMM d, h:mm a")}
                                                    </p>
                                                </div>
                                                {!n.isRead && (
                                                    <button
                                                        onClick={(e) => handleMarkRead(n._id, e)}
                                                        className="self-center p-2 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 text-primary-600 transition-all scale-0 group-hover:scale-100"
                                                        title="Mark as read"
                                                    >
                                                        <Check size={16} strokeWidth={3} />
                                                    </button>
                                                )}
                                                {!n.isRead && (
                                                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:hidden" />
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

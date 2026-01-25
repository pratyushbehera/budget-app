const Notification = require("../models/Notification");
const { runDailyReminder, runWeeklyInsight } = require("../jobs/notificationJobs");

// Get notifications for logged in user
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50); // limit last 50
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mark single notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findOneAndUpdate(
            { _id: id, recipient: req.user.id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mark all as read
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, isRead: false },
            { isRead: true }
        );
        res.json({ message: "All notifications marked as read" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CRON JOB HANDLERS (Protected by cronAuth)
exports.triggerDailyReminder = async (req, res) => {
    try {
        await runDailyReminder();
        res.json({ message: "Daily reminder job executed" });
    } catch (err) {
        console.error("Daily reminder error:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.triggerWeeklyInsight = async (req, res) => {
    try {
        await runWeeklyInsight();
        res.json({ message: "Weekly insight job executed" });
    } catch (err) {
        console.error("Weekly insight error:", err);
        res.status(500).json({ message: err.message });
    }
};

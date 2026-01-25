const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const cronAuth = require("../middleware/cronAuth");
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    triggerDailyReminder,
    triggerWeeklyInsight,
} = require("../controllers/notificationController");

// User routes
router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);

// Cron routes (Protected by CRON_SECRET)
router.post("/cron/daily-reminder", cronAuth, triggerDailyReminder);
router.post("/cron/weekly-insight", cronAuth, triggerWeeklyInsight);

module.exports = router;

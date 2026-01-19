const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { generateWeeklyInsights } = require("../controllers/insightController");

router.post("/generate", protect, generateWeeklyInsights);

module.exports = router;

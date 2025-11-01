const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  saveInsight,
  getInsight,
  generateAIInsight,
} = require("../controllers/insightController");

router.post("/", protect, saveInsight);
router.get("/:year/:month", protect, getInsight);
router.post("/generate", protect, generateAIInsight);

module.exports = router;

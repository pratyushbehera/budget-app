const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getRecurringInstances, enableRecurringRule, deleteRecurringRule } = require("../controllers/recurringController");
const {
  approveRecurringInstance,
} = require("../controllers/recurringController");
const { skipRecurringInstance } = require("../controllers/recurringController");
const { getRecurringRules } = require("../controllers/recurringController");
const { createRecurringRule } = require("../controllers/recurringController");
const { stopRecurringRule } = require("../controllers/recurringController");

router.get("/recurring-instances", protect, getRecurringInstances);

router.get("/recurring-rules", protect, getRecurringRules);

router.post(
  "/recurring-instances/:id/approve",
  protect,
  approveRecurringInstance
);

router.post("/recurring-instances/:id/skip", protect, skipRecurringInstance);

router.post("/recurring-rules", protect, createRecurringRule);

router.post("/recurring-rules/:id/stop", protect, stopRecurringRule);

router.post(
  "/recurring-rules/:id/enable",
  protect,
  enableRecurringRule
);

router.delete(
  "/recurring-rules/:id",
  protect,
  deleteRecurringRule
);

//TODO: Keep it for dev testing
router.post("/recurring-cron-run", protect, async (req, res) => {
  const { runRecurringCron } = require("../jobs/recurringCron");
  await runRecurringCron();
  res.json({ message: "Recurring cron executed" });
});

module.exports = router;

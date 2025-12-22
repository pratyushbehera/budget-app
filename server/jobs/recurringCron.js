const { RecurringRule, RecurringInstance } = require("../models/Recurring");
const { addMonths, addWeeks } = require("../utils/recurringDate");

exports.runRecurringCron = async () => {
  const today = new Date().toISOString().split("T")[0];

  const rules = await RecurringRule.find({
    isActive: true,
    nextRunAt: { $lte: today },
  });

  for (const rule of rules) {
    try {
      // 🔁 Create pending instance (idempotent)
      await RecurringInstance.create({
        recurringRuleId: rule._id,
        userId: rule.userId,
        dueDate: rule.nextRunAt,
        amount: rule.amount,
        status: "pending",
      });

      // ⏭ Advance nextRunAt
      if (rule.frequency === "monthly") {
        rule.nextRunAt = addMonths(rule.nextRunAt, rule.interval || 1);
      } else if (rule.frequency === "weekly") {
        rule.nextRunAt = addWeeks(rule.nextRunAt, rule.interval || 1);
      }

      await rule.save();
    } catch (err) {
      // Duplicate instance → safe to ignore
      if (err.code !== 11000) {
        console.error("Recurring cron error:", err);
      }
    }
  }
};

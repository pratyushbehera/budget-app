const { RecurringInstance, RecurringRule } = require("../models/Recurring");
const { Transaction } = require("../models/Budget");
const Group = require("../models/Group");

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

exports.getRecurringInstances = async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.user.id;

    const filter = { userId };

    if (status) {
      filter.status = status;
    }

    const instances = await RecurringInstance.find(filter)
      .populate("recurringRuleId")
      .sort({ dueDate: 1 })
      .lean();

    // Shape data for frontend
    const result = instances.map((i) => ({
      _id: i._id,
      amount: i.amount,
      dueDate: i.dueDate,
      status: i.status,
      title: i.recurringRuleId?.title,
      category: i.recurringRuleId?.category,
      frequency: i.recurringRuleId?.frequency,
      recurringRuleId: i.recurringRuleId?._id,
    }));

    res.json(result);
  } catch (err) {
    console.error("Get recurring instances error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.approveRecurringInstance = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, date } = req.body;

    const instance = await RecurringInstance.findById(id);
    if (!instance || instance.status !== "pending") {
      return res.status(400).json({ message: "Invalid instance" });
    }

    if (instance.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const rule = await RecurringRule.findById(instance.recurringRuleId);
    if (!rule) {
      return res.status(400).json({ message: "Rule not found" });
    }

    // 🔥 Create REAL transaction (reuse your schema)
    const tx = await Transaction.create({
      id: uid(),
      userId: req.user.id,
      paidBy: rule.groupId ? rule.paidBy : req.user.id,
      date: date || instance.dueDate,
      category: rule.category,
      categoryId: rule.categoryId,
      amount: amount ?? instance.amount,
      notes: `Recurring: ${rule.title}`,
      groupId: rule.groupId || null,

      splitDetails: rule.splitDetails || [],

      isRecurring: true,
      recurringInstanceId: instance._id,
    });

    instance.status = "approved";
    instance.transactionId = tx._id;
    await instance.save();

    res.json({ transaction: tx });
  } catch (err) {
    console.error("Approve recurring error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.skipRecurringInstance = async (req, res) => {
  try {
    const { id } = req.params;

    const instance = await RecurringInstance.findById(id);
    if (!instance || instance.status !== "pending") {
      return res.status(400).json({ message: "Invalid instance" });
    }

    if (instance.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    instance.status = "skipped";
    await instance.save();

    res.json({ message: "Recurring skipped" });
  } catch (err) {
    console.error("Skip recurring error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getRecurringRules = async (req, res) => {
  try {
    const { RecurringRule } = require("../models/Recurring");

    const rules = await RecurringRule.find({
      userId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(rules);
  } catch (err) {
    console.error("Get recurring rules error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.createRecurringRule = async (req, res) => {
  try {
    const {
      title,
      type,
      amount,
      category,
      categoryId,
      frequency,
      startDate,
      groupId,
      paidBy,
      splitDetails = [],
    } = req.body;

    if (!title || !amount || !categoryId || !frequency || !startDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (groupId) {
      const group = await Group.findById(groupId);

      if (!group) {
        return res.status(400).json({ message: "Invalid groupId" });
      }

      const isMember = group.members.some(
        (m) => m.userId?.toString() === req.user.id
      );

      if (!isMember) {
        return res
          .status(403)
          .json({ message: "You are not part of this group" });
      }

      if (!paidBy) {
        return res.status(400).json({
          message: "paidBy is required for group recurring",
        });
      }

      const validPayer = group.members.some(
        (m) => m.userId?.toString() === paidBy.toString()
      );

      if (!validPayer) {
        return res.status(400).json({
          message: "paidBy must be a member of the group",
        });
      }

      // Validate splitDetails
      if (!Array.isArray(splitDetails) || splitDetails.length === 0) {
        return res.status(400).json({
          message: "splitDetails required for group recurring",
        });
      }

      const groupUserIds = group.members.map((m) => m.userId?.toString());

      for (const s of splitDetails) {
        if (!groupUserIds.includes(s.userId?.toString())) {
          return res.status(400).json({
            message: "Invalid splitDetails member",
          });
        }
      }
    }

    const rule = await RecurringRule.create({
      userId: req.user.id,
      title,
      type,
      amount,
      category,
      categoryId,
      frequency,
      interval: 1,
      startDate,
      nextRunAt: startDate,
      groupId: groupId || null,
      paidBy: groupId ? paidBy : null,
      splitDetails: groupId ? splitDetails : [],
      isActive: true,
    });

    // 🔁 Create first pending instance
    await RecurringInstance.create({
      recurringRuleId: rule._id,
      userId: req.user.id,
      dueDate: startDate,
      amount,
      status: "pending",
    });

    res.status(201).json(rule);
  } catch (err) {
    console.error("Create recurring rule error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.stopRecurringRule = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const rule = await RecurringRule.findOne({
      _id: id,
      userId,
    });

    if (!rule) {
      return res.status(404).json({ message: "Recurring rule not found" });
    }

    // ⏸ Stop rule
    rule.isActive = false;
    await rule.save();

    // ⏭ Skip all pending future instances
    await RecurringInstance.updateMany(
      {
        recurringRuleId: rule._id,
        status: "pending",
      },
      { status: "skipped" }
    );

    res.json({ message: "Recurring stopped successfully" });
  } catch (err) {
    console.error("Stop recurring error:", err);
    res.status(500).json({ message: err.message });
  }
};

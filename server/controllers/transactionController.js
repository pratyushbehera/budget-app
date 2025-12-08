const { Transaction } = require("../models/Budget");
const Group = require("../models/Group");
const GroupActivity = require("../models/GroupActivity");

exports.getTransactions = async (req, res) => {
  try {
    const { month, limit } = req.query;
    const userId = req.user.id;

    // Base filter using new paidBy logic
    const filter = {
      $or: [
        { paidBy: userId }, // new group transactions
        {
          $and: [
            { paidBy: { $exists: false } }, // backward compatibility
            { userId: userId }, // old normal transactions
          ],
        },
      ],
    };

    if (month) {
      const startDate = new Date(`${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      filter.date = {
        $gte: startDate.toISOString().split("T")[0],
        $lt: endDate.toISOString().split("T")[0],
      };
    }

    const query = Transaction.find(filter).sort({ date: -1 });
    if (limit) query.limit(Number(limit));

    const transactions = await query.exec();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const {
      id,
      date,
      category,
      categoryId,
      amount,
      notes,
      groupId,
      splitDetails = [],
      paidBy,
    } = req.body;

    // ---------- GROUP VALIDATION (optional) ----------
    if (groupId) {
      const group = await Group.findById(groupId);

      if (!group) {
        return res.status(400).json({ message: "Invalid groupId" });
      }

      // Check logged user is inside the group
      const isMember = group.members.some(
        (m) => m.userId?.toString() === req.user.id.toString()
      );
      if (!isMember) {
        return res
          .status(403)
          .json({ message: "You are not part of this group" });
      }

      // Validate split details (if provided)
      if (splitDetails.length > 0) {
        const groupEmails = group.members.map((m) => m.email);
        const groupUserIds = group.members.map((m) => m.userId?.toString());

        for (const s of splitDetails) {
          const validByEmail = s.email && groupEmails.includes(s.email);
          const validById =
            s.userId && groupUserIds.includes(s.userId.toString());

          if (!validByEmail && !validById) {
            return res.status(400).json({
              message: `Split entry not in group: ${s.email || s.userId}`,
            });
          }
        }
      }
    }

    // ---------- CREATE NORMAL OR GROUP TRANSACTION ----------
    const payer = paidBy || req.user.id;
    const transaction = new Transaction({
      id,
      userId: req.user.id,
      paidBy: payer,
      date,
      category,
      categoryId,
      amount,
      notes,
      groupId: groupId || null,
      splitDetails,
    });

    const saved = await transaction.save();

    if (groupId) {
      await GroupActivity.create({
        groupId,
        type: "transaction",
        actorId: req.user.id,
        data: {
          amount,
          notes,
          paidBy,
          transactionId: saved._id,
        },
      });
    }

    return res.status(201).json(saved);
  } catch (err) {
    console.error("Add transaction error:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const filter = {
      id: req.params.id,
      $or: [
        { paidBy: req.user.id }, // new group transactions
        {
          $and: [
            { paidBy: { $exists: false } }, // backward compatibility
            { userId: req.user.id }, // old normal transactions
          ],
        },
      ],
    };
    await Transaction.deleteOne(filter);
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.editTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the transaction belonging to the user
    const transaction = await Transaction.findOne({
      id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const {
      date,
      category,
      categoryId,
      amount,
      notes,
      groupId,
      paidBy,
      splitDetails,
    } = req.body;

    // ---------- GROUP VALIDATION (only if updating group or split) ----------
    if (groupId !== undefined || splitDetails !== undefined) {
      const finalGroupId = groupId ?? transaction.groupId;

      if (finalGroupId) {
        const group = await Group.findById(finalGroupId);

        if (!group) {
          return res.status(400).json({ message: "Invalid groupId" });
        }

        const isMember = group.members.some(
          (m) => m.userId?.toString() === req.user.id.toString()
        );
        if (!isMember) {
          return res.status(403).json({
            message: "You are not part of this group",
          });
        }

        // validate split details if sent
        if (splitDetails && splitDetails.length > 0) {
          const groupEmails = group.members.map((m) => m.email);
          const groupUserIds = group.members.map((m) => m.userId?.toString());

          for (const s of splitDetails) {
            const validByEmail = s.email && groupEmails.includes(s.email);
            const validById =
              s.userId && groupUserIds.includes(s.userId.toString());

            if (!validByEmail && !validById) {
              return res.status(400).json({
                message: `Split entry not part of group: ${
                  s.email || s.userId
                }`,
              });
            }
          }
        }
      }
    }

    // ---------- UPDATE NORMAL FIELDS ----------
    if (date !== undefined) transaction.date = date;
    if (category !== undefined) transaction.category = category;
    if (categoryId !== undefined) transaction.categoryId = categoryId;
    if (amount !== undefined) transaction.amount = amount;
    if (notes !== undefined) transaction.notes = notes;

    // ---------- UPDATE GROUP FIELDS ----------
    if (groupId !== undefined) transaction.groupId = groupId;
    if (paidBy !== undefined) transaction.paidBy = paidBy;
    if (splitDetails !== undefined) transaction.splitDetails = splitDetails;

    const updated = await transaction.save();
    res.json(updated);
  } catch (err) {
    console.error("Edit transaction error:", err);
    res.status(500).json({ message: err.message });
  }
};

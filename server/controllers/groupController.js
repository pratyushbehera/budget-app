const { Transaction } = require("../models/Budget");
const Group = require("../models/Group");
const GroupActivity = require("../models/GroupActivity");
const User = require("../models/User");
const Category = require("../models/Category");

// POST /api/groups
exports.createGroup = async (req, res) => {
  try {
    const { name, description, members = [] } = req.body;

    // creator added as admin
    const creatorMember = {
      userId: req.user._id,
      email: req.user.email,
      role: "admin",
      status: "accepted",
    };

    const group = await Group.create({
      name,
      description,
      createdBy: req.user._id,
      members: [creatorMember, ...members],
    });

    res.status(201).json(group);
  } catch (err) {
    console.log("Create group error:", err);
    res.status(500).json({ message: "Failed to create group" });
  }
};

// GET /api/groups
exports.getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      "members.userId": req.user._id,
    }).select("_id name createdBy description members");

    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch groups" });
  }
};

// GET /api/groups/:groupId
exports.getGroupDetails = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate(
      "members.userId",
      "firstName email"
    );

    if (!group) return res.status(404).json({ message: "Group not found" });

    // check membership
    const isMember = group.members.some(
      (m) => m.userId?._id?.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(group);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch group details" });
  }
};

exports.getGroupTransactions = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Validate group exists
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Validate user belongs to group
    const isMember = group.members.some(
      (m) => m.userId?.toString() === req.user.id
    );
    if (!isMember)
      return res.status(403).json({ message: "Not in this group" });

    const transactions = await Transaction.find({ groupId }).sort({
      date: -1,
    });

    res.json(transactions);
  } catch (err) {
    console.error("Group transactions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getGroupSummary = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    // 1. Load group
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Ensure requester is group member
    const isMember = group.members.some(
      (m) => m.userId?.toString() === userId.toString()
    );
    if (!isMember) return res.status(403).json({ message: "Not authorized" });

    // 2. Load all group transactions
    const transactions = await Transaction.find({ groupId });

    // 3. Initialize balances
    const balances = {};
    group.members.forEach((m) => {
      const key = m.userId?.toString() || m.email;
      balances[key] = 0;
    });

    // 4. Process each transaction
    transactions.forEach((tx) => {
      const payer = tx.paidBy?.toString() || tx.userId?.toString();

      if (!balances[payer]) balances[payer] = 0;
      balances[payer] += tx.amount;

      // subtract participant shares
      tx.splitDetails.forEach((s) => {
        const memberKey = s.userId?.toString() || s.email;

        if (!balances[memberKey]) balances[memberKey] = 0;
        balances[memberKey] -= Number(s.shareAmount);
      });
    });

    // 5. Separate creditors & debtors
    const creditors = [];
    const debtors = [];

    Object.entries(balances).forEach(([user, amt]) => {
      if (amt > 0.01) creditors.push({ user, amt });
      else if (amt < -0.01) debtors.push({ user, amt: Math.abs(amt) });
    });

    // sort for greedy settlement
    creditors.sort((a, b) => b.amt - a.amt);
    debtors.sort((a, b) => b.amt - a.amt);

    // 6. Compute settlements
    const settlements = [];

    let ci = 1 - 1; // creditor index
    let di = 1 - 1; // debtor index

    let cPointer = 0;
    let dPointer = 0;

    while (dPointer < debtors.length && cPointer < creditors.length) {
      let debtor = debtors[dPointer];
      let creditor = creditors[cPointer];

      const settledAmt = Math.min(debtor.amt, creditor.amt);

      const findMember = (idOrEmail) =>
        group.members.find(
          (m) => m.userId?.toString() === idOrEmail || m.email === idOrEmail
        );
      settlements.push({
        from: {
          id: debtor.user,
          name:
            findMember(debtor.user)?.userId?.firstName ||
            findMember(debtor.user)?.email,
        },
        to: {
          id: creditor.user,
          name:
            findMember(creditor.user)?.userId?.firstName ||
            findMember(creditor.user)?.email,
        },
        amount: settledAmt,
      });

      debtor.amt -= settledAmt;
      creditor.amt -= settledAmt;

      // move pointer if settled
      if (debtor.amt < 0.01) dPointer++;
      if (creditor.amt < 0.01) cPointer++;
    }

    res.json({
      rawBalances: balances,
      settlements,
    });
  } catch (err) {
    console.error("Error computing summary:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.settleUp = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { id, from, to, amount } = req.body;

    let categoryId = null;
    const category = await Category.find({ name: "Settlement" });
    if (!category || category.length === 0) {
      const ctx = await Category.create({
        userId: from,
        type: "Expense",
        name: "Settlement",
        group: "Annual/Irregular",
      });
      categoryId = ctx._id;
    } else {
      categoryId = category[0]?._id;
    }

    // Create a transaction representing settlement
    const tx = await Transaction.create({
      id,
      userId: req.user.id, // creator
      paidBy: from, // payer
      groupId,
      amount,
      category: "Settlement",
      categoryId,
      date: new Date().toISOString().split("T")[0],
      notes: `Settlement between members`,
      splitDetails: [{ userId: to, shareAmount: amount }],
    });

    res.json(tx);

    await GroupActivity.create({
      groupId,
      type: "settle",
      actorId: from,
      data: { to, amount },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Only admin can rename group
    if (group.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Only admin can rename group" });

    if (name) group.name = name;
    if (description !== undefined) group.description = description;

    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Only creator/admin can delete
    if (group.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Only admin can delete group" });

    await group.deleteOne();

    res.json({ message: "Group deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const isAdmin = group.createdBy.toString() === userId;

    // Admin cannot leave unless there is a replacement admin
    if (isAdmin) {
      if (group.members.length === 1) {
        // only member
        await group.deleteOne();
        return res.json({
          message: "Group deleted as you were the only member",
        });
      }

      const remaining = group.members.filter(
        (m) => m.userId?.toString() !== userId
      );

      // Assign new admin (first non-admin)
      group.createdBy = remaining[0].userId;
    }

    // Remove current user
    group.members = group.members.filter(
      (m) => m.userId?.toString() !== userId
    );

    await group.save();

    await GroupActivity.create({
      groupId,
      type: "left",
      actorId: userId,
    });

    res.json({ message: "Left group successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Only admin
    if (group.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    group.members = group.members.filter(
      (m) => m.userId?.toString() !== memberId
    );

    await group.save();

    await GroupActivity.create({
      groupId,
      type: "removed",
      actorId: req.user.id,
      data: { removedUserId: memberId },
    });

    // 🔔 Notification for Removed User
    const Notification = require("../models/Notification");
    await Notification.create({
      recipient: memberId,
      type: "Group",
      title: "Removed from Group 🚫",
      message: `You were removed from "${group.name}"`,
      relatedId: group._id, // Keep ID reference even if removed, or null
    });

    res.json({ message: "Member removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.inviteMember = async (req, res) => {
  try {
    const { email } = req.body;
    const { groupId } = req.params;
    const inviterId = req.user.id;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Only admin (creator) can invite
    if (group.createdBy.toString() !== inviterId)
      return res.status(403).json({ message: "Not authorized" });

    // Prevent duplicate invites
    const existing = group.members.find((m) => m.email === email);
    if (existing)
      return res.status(400).json({ message: "User already invited" });

    // Check if email belongs to existing user
    const user = await User.findOne({ email });

    group.members.push({
      email,
      userId: user?._id || null,
      status: "pending",
      role: "member",
    });

    await group.save();

    await GroupActivity.create({
      groupId,
      type: "invite",
      actorId: inviterId,
      data: { email },
    });

    // 🔔 Notification for Invited User
    if (user) {
      const Notification = require("../models/Notification");
      await Notification.create({
        recipient: user._id,
        type: "Group",
        title: "Group Invite ✉️",
        message: `${req.user.firstName} invited you to join "${group.name}"`,
        relatedId: group._id,
      });
    }

    // TODO: send email later

    res.json({ message: "Invite sent successfully", group });
  } catch (err) {
    console.error("Invite error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.acceptInvite = async (req, res) => {
  try {
    const userId = req.user.id;
    const email = req.user.email;
    const { groupId } = req.body;

    const groups = await Group.find({ "members.email": email, _id: groupId });

    groups.forEach(async (g) => {
      const member = g.members.find((m) => m.email === email);

      if (member && member.status === "pending") {
        member.status = "accepted";
        member.userId = userId;
        await g.save();
      }
    });

    res.json({ message: "Invites accepted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGroupActivity = async (req, res) => {
  try {
    const { groupId } = req.params;

    const activities = await GroupActivity.find({ groupId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("actorId", "firstName email");

    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

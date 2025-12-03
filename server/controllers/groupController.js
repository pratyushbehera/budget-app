const { Transaction } = require("../models/Budget");
const Group = require("../models/Group");

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
    }).select("_id name");

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

    // Create a transaction representing settlement
    const tx = await Transaction.create({
      id,
      userId: req.user.id, // creator
      paidBy: from, // payer
      groupId,
      amount,
      category: "Settlement",
      notes: `Settlement between members`,
      categoryId: null,
      splitDetails: [{ userId: to, shareAmount: amount }],
    });

    res.json(tx);
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

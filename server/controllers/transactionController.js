const { Transaction } = require("../models/Budget");

exports.getTransactions = async (req, res) => {
  try {
    const { month, limit } = req.query;
    const filter = { userId: req.user.id };

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
    const transaction = new Transaction({
      id: req.body.id,
      userId: req.user.id,
      date: req.body.date,
      category: req.body.category,
      categoryId: req.body.categoryId,
      amount: req.body.amount,
      notes: req.body.notes,
    });

    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    await Transaction.deleteOne({ id: req.params.id, userId: req.user.id });
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.editTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the transaction belonging to the user
    const transaction = await Transaction.findOne({ id, userId: req.user.id });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Update fields (only those sent from FE)
    if (req.body.date !== undefined) transaction.date = req.body.date;
    if (req.body.category !== undefined) transaction.category = req.body.category;
    if (req.body.categoryId !== undefined) transaction.categoryId = req.body.categoryId;
    if (req.body.amount !== undefined) transaction.amount = req.body.amount;
    if (req.body.notes !== undefined) transaction.notes = req.body.notes;

    const updated = await transaction.save();
    res.json(updated);
  } catch (err) {
    console.error("Edit transaction error:", err);
    res.status(500).json({ message: err.message });
  }
};

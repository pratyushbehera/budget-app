const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Added userId
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  date: { type: String, required: true },
  category: { type: String, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  amount: { type: Number, required: true },
  notes: { type: String },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    default: null,
  },
  splitDetails: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      email: { type: String }, // if invited but not registered yet
      shareAmount: { type: Number, default: 0 }, // amount owed
    },
  ],
  isRecurring: { type: Boolean, default: false },
  recurringInstanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RecurringInstance",
    default: null,
  },
});

const PlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Added userId
  // To store plans as year -> month -> category -> amount
  // Example: { '2024': { '01': { 'Salary': 50000, 'Rent': 15000 } } }
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
const Plan = mongoose.model("Plan", PlanSchema);

module.exports = { Transaction, Plan };

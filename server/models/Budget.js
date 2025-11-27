const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Added userId
  date: { type: String, required: true },
  category: { type: String, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  amount: { type: Number, required: true },
  notes: { type: String },
});

const PlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Added userId
  // To store plans as year -> month -> category -> amount
  // Example: { '2024': { '01': { 'Salary': 50000, 'Rent': 15000 } } }
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
});

const InsightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    year: { type: String, required: true },
    month: { type: String, required: true },
    content: {
      type: mongoose.Schema.Types.Mixed, // can hold array/object (JSON)
      required: true,
    },
  },
  { timestamps: true }
);
InsightSchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

const Transaction = mongoose.model("Transaction", TransactionSchema);
const Plan = mongoose.model("Plan", PlanSchema);
const Insight = mongoose.model("Insight", InsightSchema);

module.exports = { Transaction, Plan, Insight };

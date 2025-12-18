const mongoose = require("mongoose");

const RecurringRuleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    title: { type: String, required: true },

    amount: { type: Number, required: true },

    category: { type: String },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    frequency: {
      type: String,
      enum: ["monthly", "weekly"],
      required: true,
    },

    interval: { type: Number, default: 1 }, // every N months

    startDate: { type: String, required: true }, // YYYY-MM-DD
    nextRunAt: { type: String, required: true },

    autoApprove: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    splitDetails: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        email: String,
        shareAmount: Number,
      },
    ],
  },
  { timestamps: true }
);

const RecurringInstanceSchema = new mongoose.Schema(
  {
    recurringRuleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecurringRule",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dueDate: { type: String, required: true },

    amount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "skipped"],
      default: "pending",
    },

    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent duplicate generation
RecurringInstanceSchema.index(
  { recurringRuleId: 1, dueDate: 1 },
  { unique: true }
);

module.exports = {
  RecurringRule: mongoose.model("RecurringRule", RecurringRuleSchema),
  RecurringInstance: mongoose.model(
    "RecurringInstance",
    RecurringInstanceSchema
  ),
};

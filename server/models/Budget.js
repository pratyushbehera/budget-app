const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    notes: { type: String },
});

const PlanSchema = new mongoose.Schema({
    // To store plans as year -> month -> category -> amount
    // Example: { '2024': { '01': { 'Salary': 50000, 'Rent': 15000 } } }
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
});

const InsightSchema = new mongoose.Schema({
    year: { type: String, required: true },
    month: { type: String, required: true },
    content: { type: String, required: true },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
    unique: ['year', 'month'] // Ensure only one insight per month/year
});

const Transaction = mongoose.model('Transaction', TransactionSchema);
const Plan = mongoose.model('Plan', PlanSchema);
const Insight = mongoose.model('Insight', InsightSchema);

module.exports = { Transaction, Plan, Insight };

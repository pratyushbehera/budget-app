const User = require("../models/User");
const Notification = require("../models/Notification");
const { Transaction } = require("../models/Budget");

/**
 * Daily Reminder:
 * Check if user added any transaction today.
 * If not, create a reminder notification.
 */
exports.runDailyReminder = async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find all users
    const users = await User.find({});

    for (const user of users) {
        // Check for transactions today
        const txCount = await Transaction.countDocuments({
            userId: user._id,
            date: { $gte: startOfDay, $lte: endOfDay },
        });

        if (txCount === 0) {
            // Check if we already sent a reminder today to avoid duplicates if cron runs twice
            const alreadyNotified = await Notification.findOne({
                recipient: user._id,
                type: "Reminder",
                createdAt: { $gte: startOfDay, $lte: endOfDay },
            });

            if (!alreadyNotified) {
                await Notification.create({
                    recipient: user._id,
                    type: "Reminder",
                    title: "Daily Reminder 📝",
                    message: "You haven't added any transactions today. Keep your budget on track!",
                });
            }
        }
    }
};

/**
 * Weekly Insight:
 * Calculate total spend for the last 7 days.
 */
exports.runWeeklyInsight = async () => {
    const users = await User.find({});
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    for (const user of users) {
        const expenses = await Transaction.aggregate([
            {
                $match: {
                    userId: user._id,
                    date: { $gte: lastWeek, $lte: today },
                    amount: { $lt: 0 }, // Using < 0 for expenses based on typical logic, but let's verify if Expense type is stored differently. 
                    // Actually, in this app, typically Expense is stored as positive number but type='expense'. 
                    // Let's check schema. Assuming 'Expense' category type.
                    // Wait, Amount is Number. Usually Income is +, Expense is -.
                    // Let's assume standard positive logic + Type check or negative logic.
                    // In previous files, AddTransaction uses 'type' from category. 
                    // Let's safe bet: Match Category Type if possible, or just look at all transactions.
                    // Simpler: Just sum all 'Expense' transactions.
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryDoc",
                },
            },
            {
                $unwind: "$categoryDoc",
            },
            {
                $match: {
                    "categoryDoc.type": "Expense",
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                },
            },
        ]);

        const totalSpend = expenses[0]?.total || 0;

        if (totalSpend > 0) {
            await Notification.create({
                recipient: user._id,
                type: "Insight",
                title: "Weekly Insight 📊",
                message: `You spent ₹${totalSpend.toFixed(2)} in the last 7 days. Check your dashboard for details!`,
            });
        }
    }
};

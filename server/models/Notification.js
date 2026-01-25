const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["General", "Reminder", "Insight", "Group"],
            default: "General",
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        relatedId: {
            type: mongoose.Schema.Types.ObjectId, // Could be TransactionId or GroupId
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);

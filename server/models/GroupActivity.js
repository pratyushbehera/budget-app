const mongoose = require("mongoose");

const GroupActivitySchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    type: { type: String, required: true }, // 'invite', 'transaction', 'removed', 'settle', 'left'
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who performed it

    // Flexible payload
    data: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GroupActivity", GroupActivitySchema);

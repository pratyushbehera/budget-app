const mongoose = require("mongoose");

const GroupMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // user may not exist yet (future invite)
  },
  email: {
    type: String,
    required: true, // either userId or email always present
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
  status: {
    type: String,
    enum: ["accepted", "pending"],
    default: "pending",
  },
});

const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [GroupMemberSchema], // initial empty; creator becomes admin
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", GroupSchema);

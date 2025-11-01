const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["Income", "Expense"], required: true },
  group: { type: String, required: true },
  name: { type: String, required: true },
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;

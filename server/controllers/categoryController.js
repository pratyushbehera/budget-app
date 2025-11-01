const Category = require("../models/Category");
const { syncUserDefaultCategories } = require("../utils/syncDefaultCategories");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.id });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { type, group, name } = req.body;
    if (!type || !group || !name)
      return res
        .status(400)
        .json({ message: "type, group, and name are required" });

    const newCategory = new Category({
      userId: req.user.id,
      type,
      group,
      name,
    });
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.deleteOne({ _id: id, userId: req.user.id });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.syncDefaultsForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    await syncUserDefaultCategories(userId);
    res.json({ message: "Default categories synced successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

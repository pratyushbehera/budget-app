const Category = require("../models/Category");
const { DEFAULT_CATEGORIES } = require("./defaultCategories");

/**
 * Sync default categories for a specific user
 * Adds missing ones without removing custom categories
 */
exports.syncUserDefaultCategories = async (userId) => {
  const userCategories = await Category.find({ userId });
  const existingNames = userCategories.map((c) => c.name.toLowerCase());

  const toInsert = [];

  for (const [group, names] of Object.entries(DEFAULT_CATEGORIES)) {
    const type = group === "Income" ? "Income" : "Expense";
    for (const name of names) {
      if (!existingNames.includes(name.toLowerCase())) {
        toInsert.push({ userId, type, group, name });
      }
    }
  }

  if (toInsert.length > 0) {
    await Category.insertMany(toInsert);
    console.log(
      `✅ Synced ${toInsert.length} new categories for user ${userId}`
    );
  } else {
    console.log(`No new categories to sync for user ${userId}`);
  }
};

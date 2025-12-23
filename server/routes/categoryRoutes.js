const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getCategories,
  addCategory,
  deleteCategory,
  syncDefaultsForUser,
} = require("../controllers/categoryController");

router.route("/").get(protect, getCategories).post(protect, addCategory);

router.route("/:id").delete(protect, deleteCategory);

router.post("/sync-defaults", protect, syncDefaultsForUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getTransactions,
  addTransaction,
  deleteTransaction,
  editTransaction,
} = require("../controllers/transactionController");

router.route("/").get(protect, getTransactions).post(protect, addTransaction);

router.route("/:id").delete(protect, deleteTransaction);

router.route("/:id").put(protect, editTransaction);

module.exports = router;

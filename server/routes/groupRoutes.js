const express = require("express");
const router = express.Router();
const {
  createGroup,
  getMyGroups,
  getGroupDetails,
  getGroupTransactions,
  getGroupSummary,
  settleUp,
  updateGroup,
} = require("../controllers/groupController");
const protect = require("../middleware/authMiddleware");

// CREATE group
router.post("/", protect, createGroup);

// Get all groups for logged user
router.get("/", protect, getMyGroups);

// Get specific group details
router.get("/:groupId", protect, getGroupDetails);

router.put("/:groupId", protect, updateGroup);

router.get("/:groupId/transactions", protect, getGroupTransactions);

router.get("/:groupId/summary", protect, getGroupSummary);

router.post("/:groupId/settle", protect, settleUp);

module.exports = router;

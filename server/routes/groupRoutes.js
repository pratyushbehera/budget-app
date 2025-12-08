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
  deleteGroup,
  leaveGroup,
  removeMember,
  inviteMember,
  acceptInvite,
  getGroupActivity,
} = require("../controllers/groupController");
const protect = require("../middleware/authMiddleware");

// CREATE group
router.post("/", protect, createGroup);

// Get all groups for logged user
router.get("/", protect, getMyGroups);

// Get specific group details
router.get("/:groupId", protect, getGroupDetails);

router.put("/:groupId", protect, updateGroup);
router.delete("/:groupId", protect, deleteGroup);

router.post("/:groupId/leave", protect, leaveGroup);

router.post("/:groupId/remove", protect, removeMember);

router.get("/:groupId/transactions", protect, getGroupTransactions);

router.get("/:groupId/summary", protect, getGroupSummary);

router.post("/:groupId/settle", protect, settleUp);

router.post("/:groupId/invite", protect, inviteMember);

router.post("/invites/accept", protect, acceptInvite);

router.get("/:groupId/activity", protect, getGroupActivity);

module.exports = router;

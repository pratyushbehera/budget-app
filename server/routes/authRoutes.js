const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;

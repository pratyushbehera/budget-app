const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendEmailOtp,
} = require("../controllers/authController");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Email verification
router.post("/verify-email", verifyEmail);
router.post("/resend-email-otp", resendEmailOtp);

module.exports = router;

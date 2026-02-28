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
  generateDeveloperKey,
} = require("../controllers/authController");

const {
  loginLimiter,
  forgotPasswordLimiter,
  verifyEmailLimiter,
  resendOtpLimiter,
} = require("../middleware/authRateLimiters");

router.post("/signup", registerUser);
router.post("/login", loginLimiter, loginUser);
router.get("/me", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/dev-key", protect, generateDeveloperKey);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPassword);

// Email verification
router.post("/verify-email", verifyEmailLimiter, verifyEmail);
router.post("/resend-email-otp", resendOtpLimiter, resendEmailOtp);

module.exports = router;

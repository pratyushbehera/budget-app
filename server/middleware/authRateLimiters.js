const { createRateLimiter } = require("./rateLimiter");

// Login: prevent brute force
exports.loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  message: "Too many login attempts. Try again in 15 minutes.",
});

// Forgot password: email bombing
exports.forgotPasswordLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: "Too many password reset requests. Try again later.",
});

// Verify email OTP
exports.verifyEmailLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 5,
  message: "Too many verification attempts. Please wait.",
});

// Resend OTP
exports.resendOtpLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: "Too many OTP requests. Please wait before retrying.",
});

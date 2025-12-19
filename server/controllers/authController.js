const User = require("../models/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { DEFAULT_CATEGORIES } = require("../utils/defaultCategories");
const Category = require("../models/Category");
const JWT_SECRET = process.env.JWT_SECRET;
const sendEmail = require("../utils/sendEmail");
const resetPasswordEmail = require("../utils/emailTemplates/resetPasswordEmail");
const verifyEmailOtp = require("../utils/emailTemplates/verifyEmailOtp");

const generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: "24h" });

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      isVerified: false,
    });

    if (user) {
      // Seed default categories
      const bulkCategories = [];

      for (const [group, names] of Object.entries(DEFAULT_CATEGORIES)) {
        const type = group === "Income" ? "Income" : "Expense";
        names.forEach((name) => {
          bulkCategories.push({
            userId: user._id,
            type,
            group,
            name,
          });
        });
      }

      const otp = user.generateEmailOtp();
      await user.save({ validateBeforeSave: false });

      await sendEmail({
        to: user.email,
        subject: "Verify your FinPal email",
        html: verifyEmailOtp({ firstName, otp }),
      });

      res.status(201).json({
        message: "Account created. Please verify your email.",
      });
      Category.insertMany(bulkCategories).catch(console.error);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res.status(403).json({
          message: "Please verify your email to continue",
          requiresVerification: true,
        });
      }

      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    if (req.body.password) user.password = req.body.password;

    const updated = await user.save();
    res.json({
      _id: updated._id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      token: generateToken(updated._id),
    });
  } catch (error) {
    if (error.code === 11000)
      res.status(400).json({ message: "Email already exists" });
    else res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    // Always return success (prevents email enumeration)
    if (!user) {
      return res.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate token via model method
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const html = resetPasswordEmail({
      firstName: user.firstName,
      resetUrl,
    });

    await sendEmail({
      to: user.email,
      subject: "FinPal – Password Reset",
      html,
    });

    res.json({
      message: "Password reset link sent",
      ...(process.env.NODE_ENV === "development" && {
        resetToken,
        resetUrl,
      }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Email could not be sent" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token is invalid or has expired",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  const crypto = require("crypto");

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const user = await User.findOne({
    email,
    emailOtp: hashedOtp,
    emailOtpExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid or expired OTP",
    });
  }

  user.isVerified = true;
  user.emailOtp = undefined;
  user.emailOtpExpire = undefined;

  await user.save();

  res.json({
    message: "Email verified successfully",
    token: generateToken(user._id),
  });
};

exports.resendEmailOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.isVerified) return res.json({ message: "Done" });

  const otp = user.generateEmailOtp();
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: user.email,
    subject: "Verify your FinPal email",
    html: verifyEmailOtp({ firstName: user.firstName, otp }),
  });

  res.json({ message: "OTP sent" });
};

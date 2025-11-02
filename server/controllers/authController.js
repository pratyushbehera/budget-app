const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { DEFAULT_CATEGORIES } = require("../utils/defaultCategories");
const Category = require("../models/Category");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ firstName, lastName, email, password });

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

      await Category.insertMany(bulkCategories);

      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: generateToken(user._id),
      });
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

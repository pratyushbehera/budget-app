
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Transaction, Plan, Insight } = require('./models/Budget');
const User = require('./models/User'); // Import User model
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

const app = express();
const PORT = process.env.PORT || 5001;

// JWT Secret
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
};

// Auth middleware
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to the request
            req.user = await User.findById(decoded.id).select('-password'); // Exclude password
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json()); // for parsing application/json

app.get('/', (req, res) => {
  res.send('Budget App API');
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Transaction Routes
app.get('/transactions', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/transactions', protect, async (req, res) => {
  const transaction = new Transaction({
    id: req.body.id,
    userId: req.user.id,
    date: req.body.date,
    category: req.body.category,
    amount: req.body.amount,
    notes: req.body.notes,
  });
  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/transactions/:id', protect, async (req, res) => {
  try {
    await Transaction.deleteOne({ id: req.params.id, userId: req.user.id });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Plan Routes
// Get all plans (should be only one document storing all month/year plans)
app.get('/plans', protect, async (req, res) => {
  try {
    const plans = await Plan.findOne({ userId: req.user.id }); // Assuming only one plan document exists per user
    res.json(plans ? plans.data : {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update/Create plans
app.post('/plans', protect, async (req, res) => {
  try {
    const { data } = req.body;
    let plan = await Plan.findOne({ userId: req.user.id });
    if (plan) {
      plan.data = data; // Update the entire data field
      await plan.save();
      res.json(plan.data);
    } else {
      // Create new plan document if none exists for this user
      plan = new Plan({ userId: req.user.id, data });
      await plan.save();
      res.status(201).json(plan.data);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Insight Routes
// Save or update an insight for a specific month/year
app.post('/insights', protect, async (req, res) => {
  try {
    const { year, month, content } = req.body;

    if (!year || !month || !content) {
      return res.status(400).json({ message: 'Year, month, and content are required.' });
    }

    let insight = await Insight.findOne({ userId: req.user.id, year, month });

    if (insight) {
      insight.content = content;
      await insight.save();
      res.json(insight);
    } else {
      insight = new Insight({ userId: req.user.id, year, month, content });
      await insight.save();
      res.status(201).json(insight);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get an insight for a specific month/year
app.get('/insights/:year/:month', protect, async (req, res) => {
  try {
    const { year, month } = req.params;
    const insight = await Insight.findOne({ userId: req.user.id, year, month });
    res.json(insight ? insight.content : ""); // Return content or empty string if not found
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// New API endpoint for AI insights
app.post('/generate-insight', protect, async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required.' });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY is not set in environment variables.");
    return res.status(500).json({ message: 'Server configuration error: API key missing.' });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3-0324:free", // Changed from deepseek/deepseek-chat-v3-0324:free due to rate limits. User may need to adjust based on their OpenRouter account/pricing plan.
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", response.status, response.statusText, errorData);
      throw new Error(`OpenRouter API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    res.json(data.choices[0].message.content); // Assuming the response structure

  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    res.status(500).json({ message: 'Failed to generate insight from AI.', error: error.message });
  }
});

// Auth Routes
// Register a new user
app.post('/api/auth/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Authenticate user and get token
app.post('/api/auth/login', async (req, res) => {
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
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

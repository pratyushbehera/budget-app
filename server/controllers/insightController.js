const { Insight } = require("../models/Budget");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const buildDashboardPrompt = (userProfile, transactions, budgets) => {
  return `
You are a financial insights assistant.

User Profile:
${JSON.stringify(userProfile)}

Recent Transactions:
${JSON.stringify(transactions)}

Monthly Budgets:
${JSON.stringify(budgets)}

Generate 3 concise insights. Each insight must include:
- title (max 7 words)
- summary (max 25 words)
- suggestion (max 20 words)

Return ONLY valid JSON array in this format:
[
  { "title": "", "summary": "", "suggestion": "" },
  { "title": "", "summary": "", "suggestion": "" },
  { "title": "", "summary": "", "suggestion": "" }
]
`;
};

exports.saveInsight = async (req, res) => {
  try {
    const { year, month, content } = req.body;

    if (!year || !month || !content) {
      return res.status(400).json({
        message: "Year, month, and content are required.",
      });
    }

    // Validate content is a JSON object/array
    if (typeof content !== "object") {
      return res.status(400).json({
        message: "Content must be a JSON object or array.",
      });
    }

    // Check if exists
    let existingInsight = await Insight.findOne({
      userId: req.user.id,
      year,
      month,
    });

    if (existingInsight) {
      existingInsight.content = content;
      const updated = await existingInsight.save();
      return res.json(updated);
    }

    // Create new
    const newInsight = await Insight.create({
      userId: req.user.id,
      year,
      month,
      content,
    });

    return res.status(201).json(newInsight);
  } catch (err) {
    console.error("Save Insight Error:", err);
    return res.status(500).json({ message: err.message });
  }
};

exports.getInsight = async (req, res) => {
  try {
    const { year, month } = req.params;

    if (!year || !month) {
      return res.status(400).json({
        message: "Year and month are required.",
      });
    }

    const insight = await Insight.findOne({
      userId: req.user.id,
      year,
      month,
    });

    // If no insights found, return empty list instead of ""
    return res.json(insight ? insight.content : []);
  } catch (err) {
    console.error("Get Insight Error:", err);
    return res.status(500).json({ message: err.message });
  }
};

exports.generateAIInsight = async (req, res) => {
  try {
    const { year, month, userProfile, transactions, budgets } = req.body;

    if (!year || !month)
      return res.status(400).json({ message: "Year and month are required." });

    // 1️⃣ Check if insight already exists for this month (cached)
    let existingInsight = await Insight.findOne({
      userId: req.user.id,
      year,
      month,
    });

    // If exists AND less than 24 hours — return cached
    if (existingInsight) {
      const createdAt = new Date(existingInsight.createdAt);
      const now = new Date();
      const diffHours = (now - createdAt) / (1000 * 60 * 60);

      if (diffHours < 24) {
        return res.json({
          source: "cache",
          content: existingInsight.content,
        });
      }
    }

    // 2️⃣ Generate Gemini insight
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = buildDashboardPrompt(userProfile, transactions, budgets);

    const response = await model.generateContent(prompt);
    const rawText = response.response.text();

    const cleaned = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let insightsJson;
    try {
      insightsJson = JSON.parse(cleaned);
    } catch (err) {
      return res.status(500).json({
        message: "Failed to parse AI response",
        raw: cleaned,
      });
    }

    // 3️⃣ Save or update in database (cache)
    let savedInsight;
    if (existingInsight) {
      existingInsight.content = insightsJson;
      savedInsight = await existingInsight.save();
    } else {
      savedInsight = await Insight.create({
        userId: req.user.id,
        year,
        month,
        content: insightsJson,
      });
    }

    res.json({
      source: "fresh",
      content: savedInsight.content,
    });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({
      message: "AI insight generation failed",
      error: error.message,
    });
  }
};

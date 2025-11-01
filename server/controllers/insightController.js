const { Insight } = require("../models/Budget");

exports.saveInsight = async (req, res) => {
  try {
    const { year, month, content } = req.body;
    if (!year || !month || !content)
      return res
        .status(400)
        .json({ message: "Year, month, and content are required." });

    let insight = await Insight.findOne({ userId: req.user.id, year, month });
    if (insight) {
      insight.content = content;
      await insight.save();
      res.json(insight);
    } else {
      const newInsight = new Insight({
        userId: req.user.id,
        year,
        month,
        content,
      });
      await newInsight.save();
      res.status(201).json(newInsight);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInsight = async (req, res) => {
  try {
    const { year, month } = req.params;
    const insight = await Insight.findOne({ userId: req.user.id, year, month });
    res.json(insight ? insight.content : "");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.generateAIInsight = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ message: "Prompt is required." });

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const data = await response.json();
    res.json(data.choices[0].message.content);
  } catch (error) {
    res
      .status(500)
      .json({ message: "AI generation failed", error: error.message });
  }
};

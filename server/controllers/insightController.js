const { GoogleGenerativeAI } = require("@google/generative-ai");

const buildWeeklyPrompt = (weeklyData) => `
You are a financial data summarizer.

Below is weekly spending comparison data.

${JSON.stringify(weeklyData, null, 2)}

Rules:
- Do NOT invent categories
- Do NOT give financial advice
- Explain spending change factually
- Max 20 words per insight

Return ONLY valid JSON array:
[
  {
    "category": "",
    "totalSpent": number,
    "previousWeekSpent": number,
    "changePercent": number,
    "insight": ""
  }
]
`;

const computeWeeklyDiff = (current, previous) => {
  return Object.keys(current).map((category) => {
    const currentSpent = current[category] || 0;
    const previousSpent = previous[category] || 0;

    const changePercent =
      previousSpent === 0
        ? 100
        : Math.round(((currentSpent - previousSpent) / previousSpent) * 100);

    return {
      category,
      totalSpent: currentSpent,
      previousWeekSpent: previousSpent,
      changePercent,
    };
  });
};

const aggregateByCategory = (transactions) => {
  return transactions.reduce((acc, tx) => {
    const category = tx.category || "Other";
    acc[category] = (acc[category] || 0) + tx.amount;
    return acc;
  }, {});
};

exports.generateWeeklyInsights = async (req, res) => {
  try {
    const { currentWeekTransactions, previousWeekTransactions } = req.body;

    if (!currentWeekTransactions || !previousWeekTransactions) {
      return res.status(400).json({
        message: "Weekly transaction data required",
      });
    }

    // 1️⃣ Aggregate
    const currentWeekAgg = aggregateByCategory(currentWeekTransactions);
    const previousWeekAgg = aggregateByCategory(previousWeekTransactions);

    // 2️⃣ Compute diff
    const weeklyComparison = computeWeeklyDiff(currentWeekAgg, previousWeekAgg);

    // Guardrail: not enough data
    if (weeklyComparison.length < 2) {
      return res.json({
        source: "insufficient-data",
        content: [],
      });
    }

    // 3️⃣ AI explanation
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = buildWeeklyPrompt(weeklyComparison);
    const response = await model.generateContent(prompt);

    const cleaned = response.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const insights = JSON.parse(cleaned);

    return res.json({
      source: "fresh",
      content: insights,
    });
  } catch (err) {
    console.error("Weekly Insight Error:", err);
    return res.status(500).json({
      message: "Weekly insight generation failed",
    });
  }
};

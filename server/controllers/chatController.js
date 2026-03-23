const { GoogleGenerativeAI } = require("@google/generative-ai");

const buildChatPrompt = (query, categoryPlanUsage) => {
  return `
  You are a helpful personal finance assistant for a user in India.
  
  User query:
  "${query}"
  
  Category plan usage (JSON):
  ${JSON.stringify(categoryPlanUsage, null, 2)}
  
  Guidelines:
  - Answer concisely in 3–6 sentences.
  - Use ONLY values from "categoryPlanUsage".
  - If suggesting improvement, cite the exact category and percentUsed.
  - Use ONLY Indian Rupees (₹). NEVER use dollars ($) or USD.
  - Do NOT hallucinate: do NOT invent categories, transactions, or numbers.
  
  When calculating:
  - Savings = plannedAmount - spentAmount (only if positive)
  - Overspend = spentAmount - plannedAmount (only if positive)
  
  IMPORTANT RULES:
  - Use ONLY INR symbol: ₹
  - Do NOT mention dollars, USD, or currency conversions.
  - Do NOT create fictional values or breakdowns.
  - Only reference categories and values that exist in categoryPlanUsage.
  - If the query requires more data than available, say so honestly.
  
  FORMAT RULES:
  - Return your answer in **Markdown**.
  - Use **bold** to highlight category names or numbers.
  - Use bullet points when explaining multiple items.
  - Do not wrap markdown in code fences.
  `;
};

exports.chatStream = async (req, res) => {
  try {
    const { query, categoryPlanUsage } = req.body;

    if (!query || typeof categoryPlanUsage !== "object") {
      return res.status(400).json({
        message: "query (string) and categoryPlanUsage (object) are required.",
      });
    }

    const prompt = buildChatPrompt(query, categoryPlanUsage);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("X-Accel-Buffering", "no");
    res.status(200);

    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(chunkText);
    }

    res.end();
  } catch (err) {
    console.error("chatStream error:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "AI chat failed", error: err.message });
    } else {
      try {
        res.end();
      } catch (e) {
        console.error("Error ending response after failure", e);
      }
    }
  }
};

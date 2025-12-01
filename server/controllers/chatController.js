const { GoogleGenerativeAI } = require("@google/generative-ai");
const escape = (s) => (s ? String(s) : "");

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

// helper: remove markdown fences (defensive)
const cleanModelText = (text) => {
  if (!text) return "";
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
};

// chunk and stream helper: sends text to client in small chunks to simulate streaming
const streamTextToResponse = async (
  res,
  text,
  chunkSize = 120,
  delayMs = 40
) => {
  // Ensure headers already set by caller
  const encoder = new TextEncoder();
  let pos = 0;
  while (pos < text.length) {
    const chunk = text.slice(pos, pos + chunkSize);
    // write chunk + newline so client can flush and render
    res.write(encoder.encode(chunk));
    pos += chunkSize;
    // small delay so client sees streaming
    await new Promise((r) => setTimeout(r, delayMs));
  }
  // end marker (optional)
  res.end();
};

exports.chatStream = async (req, res) => {
  try {
    const { query, categoryPlanUsage } = req.body;

    if (!query || typeof categoryPlanUsage !== "object") {
      return res.status(400).json({
        message: "query (string) and categoryPlanUsage (object) are required.",
      });
    }

    // Build prompt
    const prompt = buildChatPrompt(query, categoryPlanUsage);

    // Call Gemini (non-streaming)
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    // choose gemini-2.5-flash as requested
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Call model (simple generateContent)
    const result = await model.generateContent(prompt);
    const rawText = result.response.text
      ? result.response.text()
      : String(result);

    // Clean (strip fences if any)
    const cleaned = cleanModelText(rawText);

    // Prepare HTTP streaming response
    // We use chunked transfer encoding and write small chunks to simulate streaming in the client.
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("X-Accel-Buffering", "no"); // for nginx: disable buffering
    res.status(200);

    // Stream the cleaned text to the response in chunks
    await streamTextToResponse(res, cleaned, 120, 35);
    // streamTextToResponse will call res.end()
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

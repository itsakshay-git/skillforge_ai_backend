// controllers/explainController.js (CommonJS)
const axios = require("axios");

const explainCode = async (req, res) => {
  const { code, language = "JavaScript", tone = "neutral" } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  const prompt = `Explain the following ${language} code in ${tone} tone:\n\n${code}\n\nThen suggest any improvements or optimizations if possible.`;

  try {
    const llmRes = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const explanation = llmRes.data.choices[0].message.content;
    res.json({ explanation });
  } catch (err) {
    console.error("Code explanation failed:", err?.response?.data || err);
    res.status(500).json({ error: "LLM request failed" });
  }
};

module.exports = { explainCode };

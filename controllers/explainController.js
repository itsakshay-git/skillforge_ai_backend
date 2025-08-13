const axios = require("axios");
const AIInteractionService = require("../services/aiInteractionService");

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

    // Store AI interaction if user is logged in
    if (req.user) {
      try {
        await AIInteractionService.storeInteraction(
          req.user.id,
          "code_explainer",
          `Language: ${language}, Tone: ${tone}, Code length: ${code.length}`,
          explanation,
          {
            language,
            tone,
            codeLength: code.length,
            explanationLength: explanation.length,
          }
        );
      } catch (trackingError) {
        console.error("Error tracking AI interaction:", trackingError);
      }
    }

    res.json({ explanation });
  } catch (err) {
    console.error("Code explanation failed:", err?.response?.data || err);
    res.status(500).json({ error: "LLM request failed" });
  }
};

module.exports = { explainCode };

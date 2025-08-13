// controllers/emailAssistantController.js
const axios = require("axios");
const AIInteractionService = require("../services/aiInteractionService");

const handleEmailAssist = async (req, res) => {
  const { mode, input, tone = "neutral", recipient = "", context = "" } = req.body;

  if (!input || !mode) {
    return res.status(400).json({ error: "Mode and input are required" });
  }

  let prompt = "";
  if (mode === "write") {
    prompt = `Write a professional email in a ${tone} tone to ${recipient}. The topic or intent of the email is:\n${input}\n\nInclude a subject and keep it clear and concise.`;
  } else if (mode === "reply") {
    prompt = `Reply to the following email in a ${tone} tone:\n"${input}"\n\nContext: ${context}\n\nWrite a proper, respectful reply.`;
  } else if (mode === "summarize") {
    prompt = `Summarize this email:\n${input}`;
  } else {
    return res.status(400).json({ error: "Invalid mode" });
  }

  try {
    const aiResponse = await axios.post(
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

    const response = aiResponse.data.choices[0].message.content;

    // Store AI interaction if user is authenticated
    if (req.user) {
      try {
        await AIInteractionService.storeInteraction(
          req.user.id,
          "email_assistant",
          `Mode: ${mode}, Tone: ${tone}, Recipient: ${recipient || "N/A"}, Input length: ${input.length}`,
          response,
          {
            mode,
            tone,
            recipient,
            inputLength: input.length,
            responseLength: response.length,
            contextLength: context?.length || 0,
          }
        );
      } catch (trackingError) {
        console.error("Error tracking AI interaction:", trackingError);
      }
    }

    res.json({ response });
  } catch (err) {
    console.error("Email Assistant Error:", err?.response?.data || err);
    res.status(500).json({ error: "Failed to get AI response" });
  }
};

module.exports = { handleEmailAssist };

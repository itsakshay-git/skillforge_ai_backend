const axios = require("axios")

const generateWithOpenRouter = async (prompt, model = "mistralai/mistral-7b-instruct") => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    return response.data.choices[0].message.content
  } catch (err) {
    console.error("OpenRouter error:", err?.response?.data || err.message)
    throw new Error("Failed to generate response from OpenRouter.")
  }
}

module.exports = { generateWithOpenRouter }

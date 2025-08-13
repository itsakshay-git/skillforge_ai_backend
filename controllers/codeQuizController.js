const axios = require("axios");
const AIInteractionService = require("../services/aiInteractionService");

exports.generateQuizFromCode = async (req, res) => {
  const {
    language = "JavaScript",
    type = "mcq",
    questionCount = 5,
    topic
  } = req.body;

  if (!topic) {
    return res.status(400).json({ success: false, message: "Topic is required." });
  }

  const prompt = `
  You are an expert software instructor.
  Generate ${questionCount} ${type === "mcq" ? "multiple choice" : "interview-style"} questions 
  on the topic: "${topic}" in ${language}.
  Make sure questions are clear, relevant, and progressively challenging.
  `;

  try {
    const response = await axios.post(
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

    const quiz = response.data.choices[0].message.content;

    // Store AI interaction if user is authenticated
    if (req.user) {
      try {
        await AIInteractionService.storeInteraction(
          req.user.id,
          "generate_quiz",
          `Language: ${language}, Type: ${type}, Topic: ${topic}, Questions: ${questionCount}`,
          quiz,
          {
            language,
            type,
            topic,
            questionCount,
            quizLength: quiz.length,
          }
        );
      } catch (trackingError) {
        console.error("Error tracking AI interaction:", trackingError);
      }
    }

    res.json({ success: true, quiz });
  } catch (error) {
    console.error("LLM Error:", error?.response?.data || error.message);
    res.status(500).json({ success: false, message: "Quiz generation failed." });
  }
};

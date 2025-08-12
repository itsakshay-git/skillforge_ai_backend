const axios = require('axios')

exports.generateQuizFromCode = async (req, res) => {
  const { code, language = 'JavaScript', type = 'mcq' } = req.body

  const prompt = `
You are an expert software instructor. Based on the following ${language} code, generate 5 ${type === 'mcq' ? 'multiple choice' : 'interview-style'} questions.
Code:\n\n${code}
  `

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      }
    })

    const quiz = response.data.choices[0].message.content
    res.json({ success: true, quiz })

  } catch (error) {
    console.error('LLM Error:', error?.response?.data || error.message)
    res.status(500).json({ success: false, message: "Quiz generation failed." })
  }
}

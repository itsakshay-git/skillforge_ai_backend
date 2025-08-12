const axios = require('axios');

const summarizeTextWithLLM = async (text, tone = 'neutral') => {
  const prompt = `Summarize the following document in a ${tone} tone:\n\n${text}`;

  try {
    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000, // ✅ Set to a lower value
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.data.choices[0].message.content;
  } catch (error) {
    console.error('LLM summarization failed:', error?.response?.data || error.message);
    throw new Error('Failed to summarize text using LLM');
  }
};

module.exports = { summarizeTextWithLLM };

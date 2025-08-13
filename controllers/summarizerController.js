const { parseFileContent } = require('../utils/fileParser');
const { summarizeTextWithLLM } = require('../services/openrouter');
const AIInteractionService = require('../services/aiInteractionService');

const handleSummarize = async (req, res) => {
  try {
    const filePath = req.file.path;
    const tone = req.body.tone || 'neutral';
    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype;

    const content = await parseFileContent(filePath, originalName, mimeType);
    const summary = await summarizeTextWithLLM(content, tone);
    
    if (req.user) {
      try {
        await AIInteractionService.storeInteraction(
          req.user.id,
          'summarizer',
          `File: ${originalName}, Tone: ${tone}, Content Length: ${content.length}`,
          summary,
          {
            fileType: mimeType,
            tone: tone,
            contentLength: content.length,
            summaryLength: summary.length
          }
        );
      } catch (trackingError) {
        console.error('Error tracking AI interaction:', trackingError);
      }
    }

    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { handleSummarize };

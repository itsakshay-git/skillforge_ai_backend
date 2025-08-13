const AIInteractionService = require("../services/aiInteractionService");
const { createOptimizationPrompt } = require("../utils/resumeUtils");
const { generateWithOpenRouter } = require("../services/llmService");

const resumeOptimizer = async (req, res) => {
    let filePath = null;

    try {
      const { jobText } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No resume file uploaded"
        });
      }

      // Validate file type
      if (file.mimetype !== "application/pdf") {
        cleanupFile(file.path);
        return res.status(400).json({
          success: false,
          message: "Only PDF files are supported"
        });
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        cleanupFile(file.path);
        return res.status(400).json({
          success: false,
          message: "File size too large. Maximum size is 10MB"
        });
      }

      filePath = file.path;

      // Parse PDF content
      const resumeText = await parsePDF(filePath);

      // Validate resume content length
      if (resumeText.length > 50000) {
        return res.status(400).json({
          success: false,
          message: "Resume content is too long to process"
        });
      }

      // Create optimization prompt
      const prompt = createOptimizationPrompt(resumeText, jobText);

      // Generate optimization suggestions
      const result = await generateWithOpenRouter(prompt);

      console.log(req.user)

      // Store AI interaction if user is logged in
      if (req.user) {
        console.log(            {
              fileType: file.mimetype,
              resumeLength: resumeText.length,
              jobTextLength: jobText?.length || 0,
              resultLength: typeof result === "string" ? result.length : JSON.stringify(result).length
            })
        try {
          await AIInteractionService.storeInteraction(
            req.user.id,
            "resume_optimizer",
            `Resume file: ${file.originalname}, Job text length: ${jobText?.length || 0}`,
            result,
            {
              fileType: file.mimetype,
              resumeLength: resumeText.length,
              jobTextLength: jobText?.length || 0,
              resultLength: typeof result === "string" ? result.length : JSON.stringify(result).length
            }
          );
        } catch (trackingError) {
          console.error("Error tracking AI interaction:", trackingError);
        }
      }

      // Clean up uploaded file
      cleanupFile(filePath);

      res.json({
        success: true,
        data: result,
        message: "Resume optimization completed successfully"
      });

    } catch (error) {
      // Clean up file on error
      if (filePath) {
        cleanupFile(filePath);
      }

      console.error("Resume optimization error:", error);

      if (error.message.includes("PDF")) {
        return res.status(400).json({
          success: false,
          message: "Invalid PDF file. Please upload a valid PDF document."
        });
      }

      if (error.message.includes("LLM") || error.message.includes("OpenRouter")) {
        return res.status(503).json({
          success: false,
          message: "AI service temporarily unavailable. Please try again later."
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to process resume. Please try again."
      });
    }
}

module.exports = { resumeOptimizer };
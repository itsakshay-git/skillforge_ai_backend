const express = require("express")
const router = express.Router()
const upload = require("../middleware/upload")
const fs = require("fs")
const path = require("path")
const pdfParse = require("pdf-parse")
const { generateWithOpenRouter } = require("../services/llmService")
const { validateResumeRequest, cleanupFile, parsePDF, createOptimizationPrompt } = require("../utils/resumeUtils");


router.post("/optimize",
  upload.single("resume"),
  validateResumeRequest,
  async (req, res) => {
    let filePath = null

    try {
      const { jobText } = req.body
      const file = req.file

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No resume file uploaded"
        })
      }

      // Validate file type
      if (file.mimetype !== "application/pdf") {
        cleanupFile(file.path)
        return res.status(400).json({
          success: false,
          message: "Only PDF files are supported"
        })
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        cleanupFile(file.path)
        return res.status(400).json({
          success: false,
          message: "File size too large. Maximum size is 10MB"
        })
      }

      filePath = file.path

      // Parse PDF content
      const resumeText = await parsePDF(filePath)

      // Validate resume content length
      if (resumeText.length > 50000) {
        return res.status(400).json({
          success: false,
          message: "Resume content is too long to process"
        })
      }

      // Create optimization prompt
      const prompt = createOptimizationPrompt(resumeText, jobText)

      // Generate optimization suggestions
      const result = await generateWithOpenRouter(prompt)

      // Clean up uploaded file
      cleanupFile(filePath)

      res.json({
        success: true,
        data: result,
        message: "Resume optimization completed successfully"
      })

    } catch (error) {
      // Clean up file on error
      if (filePath) {
        cleanupFile(filePath)
      }

      console.error('Resume optimization error:', error)

      // Handle specific error types
      if (error.message.includes('PDF')) {
        return res.status(400).json({
          success: false,
          message: "Invalid PDF file. Please upload a valid PDF document."
        })
      }

      if (error.message.includes('LLM') || error.message.includes('OpenRouter')) {
        return res.status(503).json({
          success: false,
          message: "AI service temporarily unavailable. Please try again later."
        })
      }

      res.status(500).json({
        success: false,
        message: "Failed to process resume. Please try again."
      })
    }
  }
)

module.exports = router

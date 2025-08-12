// utils/resumeUtils.js
const fs = require("fs")
const pdfParse = require("pdf-parse")

exports.validateResumeRequest = (req, res, next) => {
    const { jobText } = req.body

    if (!jobText || typeof jobText !== 'string' || jobText.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: "Job description is required and must be a non-empty string"
        })
    }

    if (jobText.length > 10000) {
        return res.status(400).json({
            success: false,
            message: "Job description is too long (max 10,000 characters)"
        })
    }

    next()
}
exports.cleanupFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    } catch (error) {
        console.error('Error cleaning up file:', error)
    }
}
exports.parsePDF = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath)
        const pdf = await pdfParse(dataBuffer)

        if (!pdf.text || pdf.text.trim().length === 0) {
            throw new Error('PDF appears to be empty or unreadable')
        }

        return pdf.text
    } catch (error) {
        throw new Error(`Failed to parse PDF: ${error.message}`)
    }
}

exports.createOptimizationPrompt = (resumeText, jobText) => {
    return `You are a professional resume optimization assistant. Your task is to analyze a resume against a job description and provide actionable feedback.
  
  RESUME CONTENT:
  ${resumeText}
  
  JOB DESCRIPTION:
  ${jobText}
  
  Please provide a structured response with the following sections:
  
  1. KEYWORD ANALYSIS:
     - Identify missing keywords from the job description
     - Suggest relevant keywords to include
  
  2. IMPROVEMENT RECOMMENDATIONS:
     - Specific suggestions for resume enhancement
     - Format and structure improvements
     - Content optimization tips
  
  3. PERSONALIZED COVER LETTER:
     - A brief, tailored cover letter (2-3 paragraphs)
     - Highlight relevant experience and skills
  
  4. OVERALL SCORE:
     - Rate the resume-job match (1-10)
     - Brief explanation of the score
  
  Keep your response professional, actionable, and focused on helping the candidate improve their resume for this specific position.`
}
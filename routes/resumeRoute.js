const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { generateWithOpenRouter } = require("../services/llmService");
const {
  validateResumeRequest,
  cleanupFile,
  parsePDF,
  createOptimizationPrompt
} = require("../utils/resumeUtils");
const AIInteractionService = require("../services/aiInteractionService");
const { authenticateToken } = require("../middleware/auth");
const { resumeOptimizer } = require("../controllers/resumeOptimizerController");

router.post(
  "/optimize",
  authenticateToken,
  upload.single("resume"),
  validateResumeRequest, resumeOptimizer
);

module.exports = router;

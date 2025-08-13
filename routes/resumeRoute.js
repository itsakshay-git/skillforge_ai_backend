const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  validateResumeRequest,
  cleanupFile,
  parsePDF,
  createOptimizationPrompt
} = require("../utils/resumeUtils");
const { authenticateToken } = require("../middleware/auth");
const { resumeOptimizer } = require("../controllers/resumeOptimizerController");

router.post("/optimize", authenticateToken, upload.single("resume"), validateResumeRequest, resumeOptimizer);

module.exports = router;

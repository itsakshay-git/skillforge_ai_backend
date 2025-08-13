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
const validate = require("../middleware/validate");
const { resumeOptimizerSchema } = require("../middleware/Validation/resumeOptimizerValidation");

router.post("/optimize", authenticateToken, upload.single("resume"), validate(resumeOptimizerSchema), resumeOptimizer);

module.exports = router;

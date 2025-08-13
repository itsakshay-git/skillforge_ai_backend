const express = require("express");
const router = express.Router();
const { handleEmailAssist } = require("../controllers/emailAssistantController");
const { authenticateToken } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { emailAssistSchema } = require("../middleware/Validation/emailAssistantValidation");

router.post("/email-assist", authenticateToken,  validate(emailAssistSchema), handleEmailAssist);

module.exports = router;

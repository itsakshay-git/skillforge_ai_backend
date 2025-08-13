const express = require("express");
const router = express.Router();
const { handleEmailAssist } = require("../controllers/emailAssistantController");
const { authenticateToken } = require("../middleware/auth");

router.post("/email-assist", authenticateToken, handleEmailAssist);

module.exports = router;

const express = require("express");
const router = express.Router();
const { handleEmailAssist } = require("../controllers/emailAssistantController");

router.post("/email-assist", handleEmailAssist);

module.exports = router;

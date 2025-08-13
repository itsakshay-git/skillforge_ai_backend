const express = require("express");
const router = express.Router();
const { explainCode } = require("../controllers/explainController");
const { authenticateToken } = require("../middleware/auth");

router.post("/explain", authenticateToken, explainCode);

module.exports = router;

const express = require("express");
const router = express.Router();
const { explainCode } = require("../controllers/explainController");
const { authenticateToken } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { explainCodeSchema } = require("../middleware/Validation/explainCodeValidation");

router.post("/explain", authenticateToken, validate(explainCodeSchema), explainCode);

module.exports = router;

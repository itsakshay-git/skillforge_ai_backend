const express = require('express')
const router = express.Router()
const { generateQuizFromCode } = require('../controllers/codeQuizController')
const { authenticateToken } = require('../middleware/auth')
const validate = require('../middleware/validate')
const { generateQuizSchema } = require('../middleware/Validation/quizValidation')

router.post('/generate', authenticateToken, validate(generateQuizSchema), generateQuizFromCode)

module.exports = router

const express = require('express')
const router = express.Router()
const { generateQuizFromCode } = require('../controllers/codeQuizController')
const { authenticateToken } = require('../middleware/auth')

router.post('/generate', authenticateToken, generateQuizFromCode)

module.exports = router

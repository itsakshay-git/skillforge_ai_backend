const express = require('express')
const router = express.Router()
const { generateQuizFromCode } = require('../controllers/codeQuizController')

router.post('/generate', generateQuizFromCode)

module.exports = router

const express = require('express');
const multer = require('multer');
const { handleSummarize } = require('../controllers/summarizerController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });


router.post('/upload', upload.single('file'), handleSummarize);
router.post('/upload/authenticated', authenticateToken, upload.single('file'), handleSummarize);

module.exports = router;

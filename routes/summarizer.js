const express = require('express');
const multer = require('multer');
const { handleSummarize } = require('../controllers/summarizerController');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { summarizerSchema } = require('../middleware/Validation/summarizerValidation');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });


router.post('/upload', upload.single('file'), validate(summarizerSchema), handleSummarize);
router.post('/upload/authenticated', authenticateToken, upload.single('file'), validate(summarizerSchema), handleSummarize);

module.exports = router;

const express = require('express');
const multer = require('multer');
const { handleSummarize } = require('../controllers/summarizerController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Optional authentication - users can use the service without login
// but authenticated users get their interactions tracked
router.post(
  '/upload',
  upload.single('file'),
  handleSummarize
);

// Protected route for authenticated users only
router.post(
  '/upload/authenticated',
  authenticateToken,
  upload.single('file'),
  handleSummarize
);

module.exports = router;

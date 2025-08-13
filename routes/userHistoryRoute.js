const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')
const { userHistory, featureUsage, analytics, DeleteUserHistoryById, DeleteAllUserHistory } = require('../controllers/userHistoryController')


router.get('/history', authenticateToken, userHistory);
router.get('/feature-usage', authenticateToken, featureUsage);
router.get('/analytics/:routeType', authenticateToken, analytics);
router.delete('/history/:id', authenticateToken, DeleteUserHistoryById);
router.delete('/history', authenticateToken, DeleteAllUserHistory);

module.exports = router 
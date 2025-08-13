const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')
const { userHistory, featureUsage, analytics, DeleteUserHistoryById, DeleteAllUserHistory } = require('../controllers/userHistoryController');
const validate = require('../middleware/validate');
const { userHistoryQuerySchema, analyticsParamsSchema, deleteHistoryParamsSchema } = require('../middleware/Validation/userHistoryValidation');


router.get('/history', authenticateToken, validate(userHistoryQuerySchema), userHistory);
router.get('/feature-usage', authenticateToken, featureUsage);
router.get('/analytics/:routeType', authenticateToken, validate(analyticsParamsSchema), analytics);
router.delete('/history/:id', authenticateToken, validate(deleteHistoryParamsSchema), DeleteUserHistoryById);
router.delete('/history', authenticateToken, DeleteAllUserHistory);

module.exports = router 
const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')
const AIInteractionService = require('../services/aiInteractionService')

// Get user's AI interaction history
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query
        const history = await AIInteractionService.getUserHistory(
            req.user.id,
            parseInt(limit),
            parseInt(offset)
        )

        res.json({
            success: true,
            data: history,
            pagination: { limit: parseInt(limit), offset: parseInt(offset) }
        })
    } catch (error) {
        console.error('Error getting user history:', error)
        res.status(500).json({ error: 'Failed to fetch history' })
    }
})

// Get user's feature usage statistics
router.get('/feature-usage', authenticateToken, async (req, res) => {
    try {
        const usage = await AIInteractionService.getUserFeatureUsage(req.user.id)
        res.json({ success: true, data: usage })
    } catch (error) {
        console.error('Error getting feature usage:', error)
        res.status(500).json({ error: 'Failed to fetch feature usage' })
    }
})

// Get analytics for a specific route type
router.get('/analytics/:routeType', authenticateToken, async (req, res) => {
    try {
        const { routeType } = req.params
        const analytics = await AIInteractionService.getRouteAnalytics(routeType, req.user.id)
        res.json({ success: true, data: analytics })
    } catch (error) {
        console.error('Error getting route analytics:', error)
        res.status(500).json({ error: 'Failed to fetch analytics' })
    }
})

router.delete('/history/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await AIInteractionService.deleteHistoryItem(req.user.id, parseInt(id));

        res.json({ success: true, message: 'History item deleted' });
    } catch (error) {
        console.error('Error deleting history item:', error);
        res.status(500).json({ error: 'Failed to delete history item' });
    }
});

// Clear all history
router.delete('/history', authenticateToken, async (req, res) => {
    try {
        await AIInteractionService.clearUserHistory(req.user.id);

        res.json({ success: true, message: 'All history cleared' });
    } catch (error) {
        console.error('Error clearing history:', error);
        res.status(500).json({ error: 'Failed to clear history' });
    }
});

module.exports = router 
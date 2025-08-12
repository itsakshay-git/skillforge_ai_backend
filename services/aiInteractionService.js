const prisma = require('../lib/prisma')

class AIInteractionService {
    // Store AI interaction data
    static async storeInteraction(userId, routeType, inputData, outputData, metadata = {}) {
        try {
            const interaction = await prisma.aIInteraction.create({
                data: {
                    userId,
                    routeType,
                    inputData,
                    outputData,
                    metadata
                }
            })

            return interaction.id
        } catch (error) {
            console.error('Error storing AI interaction:', error)
            throw error
        }
    }

    // Get user's AI interaction history
    static async getUserHistory(userId, limit = 50, offset = 0) {
        try {
            const history = await prisma.aIInteraction.findMany({
                where: { userId },
                select: {
                    id: true,
                    routeType: true,
                    inputData: true,
                    outputData: true,
                    metadata: true,
                    createdAt: true
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset
            })

            return history
        } catch (error) {
            console.error('Error getting user history:', error)
            throw error
        }
    }

    // Get analytics for a specific route type
    static async getRouteAnalytics(routeType, userId = null) {
        try {
            const whereClause = { routeType }
            if (userId) {
                whereClause.userId = userId
            }

            const analytics = await prisma.aIInteraction.groupBy({
                by: ['routeType'],
                where: whereClause,
                _count: {
                    id: true
                },
                // _avg: {
                //     // Note: Prisma doesn't support LENGTH() function directly
                //     // We'll calculate this differently if needed
                // }
            })

            // Get daily counts
            const dailyCounts = await prisma.aIInteraction.groupBy({
                by: ['routeType'],
                where: whereClause,
                _count: {
                    id: true
                },
                _min: {
                    createdAt: true
                }
            })

            return {
                totalInteractions: analytics[0]?._count.id || 0,
                dailyCounts
            }
        } catch (error) {
            console.error('Error getting route analytics:', error)
            throw error
        }
    }

    // Get user's most used AI features
    static async getUserFeatureUsage(userId) {
        try {
            const usage = await prisma.aIInteraction.groupBy({
                by: ['routeType'],
                where: { userId },
                _count: {
                    id: true
                },
                _max: {
                    createdAt: true
                }
            })

            return usage.map(item => ({
                routeType: item.routeType,
                usageCount: item._count.id,
                lastUsed: item._max.createdAt
            }))
        } catch (error) {
            console.error('Error getting user feature usage:', error)
            throw error
        }
    }

    // Clean up old interactions (for data management)
    static async cleanupOldInteractions(daysOld = 90) {
        try {
            const cutoffDate = new Date()
            cutoffDate.setDate(cutoffDate.getDate() - daysOld)

            const result = await prisma.aIInteraction.deleteMany({
                where: {
                    createdAt: {
                        lt: cutoffDate
                    }
                }
            })

            return result.count
        } catch (error) {
            console.error('Error cleaning up old interactions:', error)
            throw error
        }
    }

    static async deleteHistoryItem(userId, id) {
        return prisma.aIInteraction.deleteMany({
            where: { id, userId }
        });
    }

    static async clearUserHistory(userId) {
        return prisma.aIInteraction.deleteMany({
            where: { userId }
        });
    }
}

module.exports = AIInteractionService 
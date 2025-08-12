const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Access token required' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Check if token exists in database and is not expired
        const session = await prisma.userSession.findFirst({
            where: {
                userId: decoded.userId,
                tokenHash: token,
                expiresAt: {
                    gt: new Date()
                }
            }
        })

        if (!session) {
            return res.status(401).json({ error: 'Invalid or expired token' })
        }

        req.user = { id: decoded.userId, username: decoded.username }
        next()
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' })
    }
}

const validateRegistration = (req, res, next) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' })
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' })
    }

    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email format' })
    }

    next()
}

const validateLogin = (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
    }

    next()
}

module.exports = {
    authenticateToken,
    validateRegistration,
    validateLogin
} 
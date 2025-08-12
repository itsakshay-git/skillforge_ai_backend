const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')

// User Registration
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        })

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email or username already exists' })
        }

        // Hash password
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true
            }
        })

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        // Store token in database
        await prisma.userSession.create({
            data: {
                userId: newUser.id,
                tokenHash: token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        })

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
            token
        })
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

// User Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash)
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        // Store token in database
        await prisma.userSession.create({
            data: {
                userId: user.id,
                tokenHash: token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        })

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            },
            token
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

// User Logout
const logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]

        if (token) {
            // Remove token from database
            await prisma.userSession.deleteMany({
                where: { tokenHash: token }
            })
        }

        res.json({ message: 'Logout successful' })
    } catch (error) {
        console.error('Logout error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

// Get User Profile
const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true
            }
        })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json({ user })
    } catch (error) {
        console.error('Get profile error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

// Update User Profile
const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body

        // Check if username or email already exists
        if (username || email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: email || undefined },
                        { username: username || undefined }
                    ],
                    NOT: { id: req.user.id }
                }
            })

            if (existingUser) {
                return res.status(400).json({ error: 'Username or email already taken' })
            }
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...(username && { username }),
                ...(email && { email })
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        })

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        })
    } catch (error) {
        console.error('Update profile error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

// Update Password
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' });
        }

        const user = await prisma.user.findUnique({ where: { id: req.user.id } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const saltRounds = 10;
        const newHash = await bcrypt.hash(newPassword, saltRounds);

        await prisma.user.update({
            where: { id: req.user.id },
            data: { passwordHash: newHash }
        });

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    updatePassword
} 
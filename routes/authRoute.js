const express = require('express')
const router = express.Router()
const {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    updatePassword
} = require('../controllers/authController')
const {
    authenticateToken,
    validateRegistration,
    validateLogin
} = require('../middleware/auth')

// Public routes
router.post('/register', validateRegistration, register)
router.post('/login', validateLogin, login)

// Protected routes (require authentication)
router.post('/logout', authenticateToken, logout)
router.get('/profile', authenticateToken, getProfile)
router.put('/profile', authenticateToken, updateProfile)
router.put('/password', authenticateToken, updatePassword);

module.exports = router 
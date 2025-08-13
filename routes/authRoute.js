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
    authenticateToken
} = require('../middleware/auth')

const { registerSchema, loginSchema, updateProfileSchema, updatePasswordSchema } = require('../middleware/Validation/authenticateValidation');
const validate = require('../middleware/validate');

// Public routes
router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)

// Protected routes (require authentication)
router.post('/logout', authenticateToken, logout)
router.get('/profile', authenticateToken, getProfile)
router.put('/profile', authenticateToken, validate(updateProfileSchema), updateProfile)
router.put('/password', authenticateToken, validate(updatePasswordSchema), updatePassword);

module.exports = router 
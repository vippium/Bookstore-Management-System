const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { deleteUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');


// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

// @route   DELETE /api/auth/delete
router.delete('/delete', protect, deleteUser);


module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  register,
  login,
  getMe,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

// Public routes (for testing - should be protected in production)
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);

module.exports = router;




const express = require('express');
const router = express.Router();
const { generateStory } = require('../controllers/generateController');
const { protect } = require('../middleware/auth');

// Generate story (auth required)
router.post('/story', protect, generateStory);

module.exports = router;


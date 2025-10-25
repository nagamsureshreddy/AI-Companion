const express = require('express');
const router = express.Router();
const {
  getConversations,
  getConversation,
  createConversation,
  sendMessage,
  deleteConversation
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.get('/conversations', protect, getConversations);
router.post('/conversations', protect, createConversation);
router.get('/conversations/:id', protect, getConversation);
router.post('/conversations/:id/messages', protect, sendMessage);
router.delete('/conversations/:id', protect, deleteConversation);

module.exports = router;


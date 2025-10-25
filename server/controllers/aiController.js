const Conversation = require('../models/Conversation');

// @desc    Get all conversations for a user
// @route   GET /api/ai/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ 
      userId: req.user.id,
      isActive: true 
    }).sort({ updatedAt: -1 });
    
    res.status(200).json({
      status: 'success',
      count: conversations.length,
      data: { conversations }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single conversation
// @route   GET /api/ai/conversations/:id
// @access  Private
exports.getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!conversation) {
      return res.status(404).json({
        status: 'error',
        message: 'Conversation not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { conversation }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Create new conversation
// @route   POST /api/ai/conversations
// @access  Private
exports.createConversation = async (req, res) => {
  try {
    const { title } = req.body;
    
    const conversation = await Conversation.create({
      userId: req.user.id,
      title: title || 'New Conversation',
      messages: []
    });
    
    res.status(201).json({
      status: 'success',
      data: { conversation }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Send message to AI
// @route   POST /api/ai/conversations/:id/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!conversation) {
      return res.status(404).json({
        status: 'error',
        message: 'Conversation not found'
      });
    }
    
    // Add user message
    conversation.messages.push({
      role: 'user',
      content
    });
    
    // TODO: Integrate with your AI service (OpenAI, etc.)
    // For now, just echo back a placeholder response
    const aiResponse = `AI response to: "${content}". (AI integration pending)`;
    
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse
    });
    
    await conversation.save();
    
    res.status(200).json({
      status: 'success',
      data: { 
        conversation,
        lastMessage: conversation.messages[conversation.messages.length - 1]
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete conversation
// @route   DELETE /api/ai/conversations/:id
// @access  Private
exports.deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isActive: false },
      { new: true }
    );
    
    if (!conversation) {
      return res.status(404).json({
        status: 'error',
        message: 'Conversation not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};


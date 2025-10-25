const UserFavorite = require('../models/UserFavorite');

// @desc    Get all favorites for a user
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await UserFavorite.find({ 
      userId: req.user.id,
      isActive: true 
    }).sort({ updatedAt: -1 });
    
    res.status(200).json({
      status: 'success',
      count: favorites.length,
      data: { favorites }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Add a new favorite
// @route   POST /api/favorites
// @access  Private
exports.addFavorite = async (req, res) => {
  try {
    const { itemType, title, description, content, metadata, tags } = req.body;
    
    const favorite = await UserFavorite.create({
      userId: req.user.id,
      itemType: itemType || 'other',
      title,
      description: description || '',
      content: content || '',
      metadata: metadata || {},
      tags: tags || []
    });
    
    res.status(201).json({
      status: 'success',
      data: { favorite }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single favorite
// @route   GET /api/favorites/:id
// @access  Private
exports.getFavorite = async (req, res) => {
  try {
    const favorite = await UserFavorite.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!favorite) {
      return res.status(404).json({
        status: 'error',
        message: 'Favorite not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { favorite }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update favorite
// @route   PUT /api/favorites/:id
// @access  Private
exports.updateFavorite = async (req, res) => {
  try {
    const { title, description, content, metadata, tags } = req.body;
    
    const favorite = await UserFavorite.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, description, content, metadata, tags },
      { new: true, runValidators: true }
    );
    
    if (!favorite) {
      return res.status(404).json({
        status: 'error',
        message: 'Favorite not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { favorite }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete favorite
// @route   DELETE /api/favorites/:id
// @access  Private
exports.deleteFavorite = async (req, res) => {
  try {
    const favorite = await UserFavorite.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isActive: false },
      { new: true }
    );
    
    if (!favorite) {
      return res.status(404).json({
        status: 'error',
        message: 'Favorite not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Favorite deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  getFavorite,
  updateFavorite,
  deleteFavorite
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getFavorites);
router.post('/', protect, addFavorite);
router.get('/:id', protect, getFavorite);
router.put('/:id', protect, updateFavorite);
router.delete('/:id', protect, deleteFavorite);

module.exports = router;

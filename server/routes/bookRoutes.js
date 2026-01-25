const express = require('express');
const router = express.Router();
const {
  createBook,
  getBooks,
  getBook,
  getMyBooks,
  startReading,
  stopReading,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');
const {
  rateBook,
  getBookReviews,
  getTrendingBooks,
  getPopularBooks,
  shareBook,
  getBookStats,
} = require('../controllers/sharingController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getBooks);
router.get('/trending', getTrendingBooks);
router.get('/popular', getPopularBooks);
router.get('/stats', getBookStats);
router.get('/:id', getBook);
router.get('/:id/reviews', getBookReviews);

// Protected routes
router.post('/', protect, createBook);
router.get('/my-books', protect, getMyBooks);
router.post('/:id/start-reading', protect, startReading);
router.post('/:id/stop-reading', protect, stopReading);
router.post('/:id/rate', protect, rateBook);
router.post('/:id/share', protect, shareBook);
router.put('/:id', protect, updateBook);
router.delete('/:id', protect, deleteBook);

module.exports = router;


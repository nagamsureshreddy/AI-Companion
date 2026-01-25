const Book = require('../models/Book');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Rate and review a book
 * @route   POST /api/books/:id/rate
 * @access  Private
 */
exports.rateBook = asyncHandler(async (req, res, next) => {
  const { rating, review } = req.body;
  const bookId = req.params.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid rating (1-5)',
    });
  }

  const book = await Book.findById(bookId);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found',
    });
  }

  // Check if user already rated this book
  const existingRating = book.ratings.find(
    (r) => r.user.toString() === req.user.id.toString()
  );

  if (existingRating) {
    // Update existing rating
    existingRating.rating = rating;
    existingRating.review = review || existingRating.review;
    existingRating.createdAt = Date.now();
  } else {
    // Add new rating
    book.ratings.push({
      user: req.user.id,
      rating,
      review: review || '',
    });
  }

  await book.save();

  res.json({
    success: true,
    message: 'Rating submitted successfully',
    data: {
      averageRating: book.averageRating,
      totalRatings: book.totalRatings,
    },
  });
});

/**
 * @desc    Get book reviews
 * @route   GET /api/books/:id/reviews
 * @access  Public
 */
exports.getBookReviews = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id)
    .populate('ratings.user', 'name email')
    .select('ratings averageRating totalRatings');

  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found',
    });
  }

  res.json({
    success: true,
    data: {
      reviews: book.ratings,
      averageRating: book.averageRating,
      totalRatings: book.totalRatings,
    },
  });
});

/**
 * @desc    Get trending books (most readers)
 * @route   GET /api/books/trending
 * @access  Public
 */
exports.getTrendingBooks = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;

  const books = await Book.find({ isPublic: true })
    .populate('author', 'name email')
    .sort({ activeReadersCount: -1, readerCount: -1, createdAt: -1 })
    .limit(limit);

  res.json({
    success: true,
    count: books.length,
    data: books,
  });
});

/**
 * @desc    Get popular books (highest rated)
 * @route   GET /api/books/popular
 * @access  Public
 */
exports.getPopularBooks = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;

  const books = await Book.find({ 
    isPublic: true,
    totalRatings: { $gte: 1 },
  })
    .populate('author', 'name email')
    .sort({ averageRating: -1, totalRatings: -1 })
    .limit(limit);

  res.json({
    success: true,
    count: books.length,
    data: books,
  });
});

/**
 * @desc    Share a book (increment share count)
 * @route   POST /api/books/:id/share
 * @access  Private
 */
exports.shareBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found',
    });
  }

  book.shareCount += 1;
  await book.save();

  res.json({
    success: true,
    message: 'Book shared successfully',
    data: {
      shareCount: book.shareCount,
    },
  });
});

/**
 * @desc    Get reading statistics
 * @route   GET /api/books/stats
 * @access  Public
 */
exports.getBookStats = asyncHandler(async (req, res, next) => {
  const totalBooks = await Book.countDocuments({ isPublic: true });
  const totalReaders = await Book.aggregate([
    { $match: { isPublic: true } },
    { $project: { readerCount: 1 } },
    { $group: { _id: null, total: { $sum: '$readerCount' } } },
  ]);

  const totalShares = await Book.aggregate([
    { $match: { isPublic: true } },
    { $project: { shareCount: 1 } },
    { $group: { _id: null, total: { $sum: '$shareCount' } } },
  ]);

  const genreStats = await Book.aggregate([
    { $match: { isPublic: true } },
    { $group: { _id: '$genre', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.json({
    success: true,
    data: {
      totalBooks,
      totalReaders: totalReaders[0]?.total || 0,
      totalShares: totalShares[0]?.total || 0,
      genreStats,
    },
  });
});













const Book = require('../models/Book');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Create a new book
 * @route   POST /api/books
 * @access  Private (Author only)
 */
exports.createBook = asyncHandler(async (req, res, next) => {
  const { content, genre, shortDescription, imageUrl, title: providedTitle } = req.body;

  // Validation
  if (!content || !content.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Please provide book content (sentence)',
    });
  }

  // Check if user is an author
  if (req.user.role !== 'author' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only authors can create books',
    });
  }

  // Title: require provided title to avoid mixing with short description/content
  const title = providedTitle && providedTitle.trim().length > 0
    ? providedTitle.trim()
    : null;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a title',
    });
  }

  // Create book
  const book = await Book.create({
    title,
    content: content.trim(),
    genre: genre || 'Fiction',
    author: req.user.id,
    authorName: req.user.name,
    readers: [],
    readerCount: 0,
    shortDescription: shortDescription || undefined,
    imageUrl: imageUrl || undefined,
  });

  res.status(201).json({
    success: true,
    message: 'Book created successfully',
    data: book,
  });
});

/**
 * @desc    Get all books
 * @route   GET /api/books
 * @access  Public
 */
exports.getBooks = asyncHandler(async (req, res, next) => {
  const { genre, author, search } = req.query;
  const query = {};

  // Filter by genre
  if (genre) {
    query.genre = genre;
  }

  // Filter by author
  if (author) {
    query.author = author;
  }

  // Search in title and content
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  const booksDocs = await Book.find(query)
    .populate('author', 'name email')
    .populate('readers.user', 'name')
    .sort({ createdAt: -1 });

  const books = booksDocs.map((b) => {
    const obj = b.toObject({ getters: true });
    if (b.imageId && !obj.imageUrl) {
      obj.imageUrl = `/api/books/${b._id}/image`;
    }
    return obj;
  });

  res.json({
    success: true,
    count: books.length,
    data: books,
  });
});

/**
 * @desc    Get single book
 * @route   GET /api/books/:id
 * @access  Public
 */
exports.getBook = asyncHandler(async (req, res, next) => {
  const bookDoc = await Book.findById(req.params.id)
    .populate('author', 'name email')
    .populate('readers.user', 'name email')
    .populate('ratings.user', 'name email');

  if (!bookDoc) {
    return res.status(404).json({
      success: false,
      message: 'Book not found',
    });
  }

  const book = bookDoc.toObject({ getters: true });
  if (bookDoc.imageId && !book.imageUrl) {
    book.imageUrl = `/api/books/${bookDoc._id}/image`;
  }

  res.json({
    success: true,
    data: book,
  });
});

/**
 * @desc    Get books by current user (author's books)
 * @route   GET /api/books/my-books
 * @access  Private (Author only)
 */
exports.getMyBooks = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'author' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only authors can view their books',
    });
  }

  const books = await Book.find({ author: req.user.id })
    .populate('readers.user', 'name')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: books.length,
    data: books,
  });
});

/**
 * @desc    Start reading a book (add reader)
 * @route   POST /api/books/:id/start-reading
 * @access  Private (Reader only)
 */
exports.startReading = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found',
    });
  }

  // Check if user is already reading this book
  const existingReader = book.readers.find(
    (r) => r.user.toString() === req.user.id.toString()
  );

  if (existingReader && existingReader.isCurrentlyReading) {
    return res.status(400).json({
      success: false,
      message: 'You are already reading this book',
    });
  }

  if (existingReader) {
    // Resume reading
    existingReader.isCurrentlyReading = true;
    existingReader.startedReading = Date.now();
    existingReader.finishedReading = null;
  } else {
    // Add new reader
    book.readers.push({
      user: req.user.id,
      startedReading: Date.now(),
      isCurrentlyReading: true,
    });
  }

  await book.save();

  const updatedBook = await Book.findById(req.params.id)
    .populate('author', 'name email')
    .populate('readers.user', 'name');

  res.json({
    success: true,
    message: 'Started reading book',
    data: updatedBook,
  });
});

/**
 * @desc    Stop reading a book (remove reader)
 * @route   POST /api/books/:id/stop-reading
 * @access  Private (Reader only)
 */
exports.stopReading = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found',
    });
  }

  // Find reader
  const reader = book.readers.find(
    (r) => r.user.toString() === req.user.id.toString()
  );

  if (!reader || !reader.isCurrentlyReading) {
    return res.status(400).json({
      success: false,
      message: 'You are not currently reading this book',
    });
  }

  // Mark as finished reading
  reader.isCurrentlyReading = false;
  reader.finishedReading = Date.now();

  await book.save();

  const updatedBook = await Book.findById(req.params.id)
    .populate('author', 'name email')
    .populate('readers.user', 'name');

  res.json({
    success: true,
    message: 'Stopped reading book',
    data: updatedBook,
  });
});

/**
 * @desc    Update book
 * @route   PUT /api/books/:id
 * @access  Private (Author only - owner)
 */
exports.updateBook = asyncHandler(async (req, res, next) => {
  let book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found',
    });
  }

  // Check if user is the author
  if (book.author.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this book',
    });
  }

  // Update fields
  const { content, genre, title } = req.body;

  if (content) {
    book.content = content.trim();
    // Update title if content changed significantly
    if (!title) {
      book.title =
        content.length > 50 ? content.substring(0, 50).trim() + '...' : content.trim();
    }
  }

  if (genre) {
    book.genre = genre;
  }

  if (title) {
    book.title = title.trim();
  }

  book = await book.save();

  res.json({
    success: true,
    message: 'Book updated successfully',
    data: book,
  });
});

/**
 * @desc    Delete book
 * @route   DELETE /api/books/:id
 * @access  Private (Author only - owner)
 */
exports.deleteBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found',
    });
  }

  // Check if user is the author
  if (book.author.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this book',
    });
  }

  await book.deleteOne();

  res.json({
    success: true,
    message: 'Book deleted successfully',
    data: {},
  });
});


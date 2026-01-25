const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { protect } = require('../middleware/auth');
const Book = require('../models/Book');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload image for a book (GridFS)
router.post('/:id/image', protect, upload.single('image'), async (req, res) => {
  try {
    const bookId = req.params.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Only author or admin
    if (book.author.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to upload image for this book' });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'bookImages',
    });

    // If existing image, delete it
    if (book.imageId) {
      try {
        await bucket.delete(new mongoose.Types.ObjectId(book.imageId));
      } catch (e) {
        // ignore if not found
      }
    }

    const uploadStream = bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
    });

    uploadStream.end(file.buffer, async (err, storedFile) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error uploading image', error: err.message });
      }

      book.imageId = storedFile._id;
      book.imageUrl = `/api/books/${bookId}/image`;
      await book.save();

      res.json({
        success: true,
        message: 'Image uploaded',
        data: { imageId: storedFile._id },
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Serve image by book id
router.get('/:id/image', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book || !book.imageId) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'bookImages',
    });

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(book.imageId));
    downloadStream.on('file', (file) => {
      res.set('Content-Type', file.contentType || 'application/octet-stream');
    });
    downloadStream.on('error', () => {
      res.status(404).json({ success: false, message: 'Image not found' });
    });
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Please provide book content'],
    trim: true,
  },
  genre: {
    type: String,
    required: [true, 'Please provide a genre'],
    trim: true,
    enum: [
      'Fiction',
      'Non-Fiction',
      'Mystery',
      'Thriller',
      'Romance',
      'Science Fiction',
      'Fantasy',
      'Horror',
      'Biography',
      'History',
      'Poetry',
      'Drama',
      'Comedy',
      'Adventure',
      'Other',
    ],
    default: 'Fiction',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'Short description cannot be more than 500 characters'],
  },
  // Book Sharing Features
  readers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      startedReading: {
        type: Date,
        default: Date.now,
      },
      finishedReading: {
        type: Date,
      },
      isCurrentlyReading: {
        type: Boolean,
        default: true,
      },
    },
  ],
  readerCount: {
    type: Number,
    default: 0,
  },
  activeReadersCount: {
    type: Number,
    default: 0,
  },
  // Ratings and Reviews
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
      review: {
        type: String,
        trim: true,
        maxlength: [1000, 'Review cannot be more than 1000 characters'],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  // Sharing Status
  isPublic: {
    type: Boolean,
    default: true,
  },
  shareCount: {
    type: Number,
    default: 0,
  },
  // Book Metadata
  tags: [{
    type: String,
    trim: true,
  }],
  language: {
    type: String,
    default: 'English',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update counts and ratings before saving
bookSchema.pre('save', function (next) {
  // Update reader counts
  this.readerCount = this.readers ? this.readers.length : 0;
  this.activeReadersCount = this.readers 
    ? this.readers.filter(r => r.isCurrentlyReading).length 
    : 0;
  
  // Calculate average rating
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    this.averageRating = (sum / this.ratings.length).toFixed(1);
    this.totalRatings = this.ratings.length;
  }
  
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
bookSchema.index({ author: 1 });
bookSchema.index({ genre: 1 });
bookSchema.index({ createdAt: -1 });
bookSchema.index({ averageRating: -1 });
bookSchema.index({ readerCount: -1 });
bookSchema.index({ activeReadersCount: -1 });
bookSchema.index({ tags: 1 });

module.exports = mongoose.model('Book', bookSchema);


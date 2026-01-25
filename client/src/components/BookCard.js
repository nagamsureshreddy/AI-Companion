import React from 'react';
import { formatDate } from '../utils/helpers';
import './BookCard.css';

const BookCard = ({ book, isReading, onStartReading, onStopReading, onDelete, onShare, onRate, isAuthor, compact = false }) => {
  const handleReadingClick = () => {
    if (isReading) {
      onStopReading(book._id);
    } else {
      onStartReading(book._id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(book._id);
    }
  };

  if (compact) {
    return (
      <div className="book-card-compact">
        {!isAuthor && (
          <button
            onClick={handleReadingClick}
            className={isReading ? 'btn-stop-reading-compact' : 'btn-start-reading-compact'}
          >
            {isReading ? '✓ Reading' : '▶ Read'}
          </button>
        )}
        {onShare && !isAuthor && (
          <button
            onClick={handleShare}
            className="btn-share-compact"
            title="Share this book"
          >
            🔗
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="book-card">
      <div className="book-header">
        <h3>{book.title}</h3>
        <span className={`genre-badge genre-${book.genre?.toLowerCase().replace(' ', '-')}`}>
          {book.genre}
        </span>
      </div>
      
      <div className="book-content">
        <p>{book.content}</p>
      </div>
      
      {/* Ratings */}
      {book.averageRating > 0 && (
        <div className="book-rating">
          <span className="stars">⭐ {book.averageRating}</span>
          <span className="rating-count">({book.totalRatings} reviews)</span>
        </div>
      )}
      
      <div className="book-footer">
        <div className="book-info">
          <p className="author-name">
            <strong>Author:</strong> {book.authorName || (book.author?.name || 'Unknown')}
          </p>
          <div className="book-stats">
            <p className="reader-count">
              <strong>📚 Active Readers:</strong> {book.activeReadersCount || 0}
            </p>
            <p className="total-readers">
              <strong>Total Readers:</strong> {book.readerCount || 0}
            </p>
            {book.shareCount > 0 && (
              <p className="share-count">
                <strong>🔗 Shared:</strong> {book.shareCount} times
              </p>
            )}
          </div>
          <p className="book-date">
            {formatDate(book.createdAt)}
          </p>
        </div>
        
        <div className="book-actions">
          {isAuthor ? (
            <button 
              onClick={() => onDelete(book._id)} 
              className="btn-delete"
            >
              Delete
            </button>
          ) : (
            <>
              <button
                onClick={handleReadingClick}
                className={isReading ? 'btn-stop-reading' : 'btn-start-reading'}
              >
                {isReading ? '✓ Stop Reading' : '▶ Start Reading'}
              </button>
              {onShare && (
                <button
                  onClick={handleShare}
                  className="btn-share"
                  title="Share this book"
                >
                  🔗 Share
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;


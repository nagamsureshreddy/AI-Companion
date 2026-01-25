import React from 'react';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import './BookExplorationSection.css';

const BookExplorationSection = ({ 
  books, 
  loading, 
  onStartReading, 
  onStopReading, 
  onShare,
  isUserReadingBook 
}) => {
  return (
    <section className="book-exploration-section">
      <div className="section-content">
        <div className="section-header">
          <div className="placeholder-rectangle"></div>
          <h2 className="section-title">Explore the list of books to read</h2>
        </div>
        {loading && books.length === 0 ? (
          <Loading message="Loading books..." />
        ) : books.length === 0 ? (
          <p className="empty-message">No books available yet. Be the first to create one!</p>
        ) : (
          <div className="books-grid">
            {books.slice(0, 8).map((book) => {
              const titleText = book.title || 'Untitled';
              return (
                <div key={book._id} className="book-card-wrapper">
                  {book.imageUrl ? (
                    <img src={book.imageUrl} alt={titleText} className="book-placeholder image" />
                  ) : (
                    <div className="book-placeholder"></div>
                  )}
                  <p className="book-title">
                    <Link to={`/book/${book._id}`}>{titleText}</Link>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookExplorationSection;


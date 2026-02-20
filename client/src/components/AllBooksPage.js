import React, { useEffect, useState } from 'react';
import NewHeader from './NewHeader';
import Loading from './Loading';
import { useAuth } from '../context/AuthContext';
import { bookService } from '../services/api';
import { getErrorMessage } from '../utils/helpers';
import './AllBooksPage.css';

const AllBooksPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getAll();
      const list = response.data || [];
      // show newest first if timestamps exist
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setBooks(list);
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Error fetching books: ' + getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleStartReading = async (bookId) => {
    try {
      await bookService.startReading(bookId);
      fetchBooks();
    } catch (error) {
      alert('Error: ' + getErrorMessage(error));
    }
  };

  const handleStopReading = async (bookId) => {
    try {
      await bookService.stopReading(bookId);
      fetchBooks();
    } catch (error) {
      alert('Error: ' + getErrorMessage(error));
    }
  };

  const handleShareBook = async (bookId) => {
    try {
      await bookService.shareBook(bookId);
      alert('Book shared successfully!');
      fetchBooks();
    } catch (error) {
      alert('Error: ' + getErrorMessage(error));
    }
  };

  const isUserReadingBook = (book) => {
    if (!user || !book.readers) return false;
    return book.readers.some((reader) => {
      const readerId =
        typeof reader === 'object' && reader.user
          ? reader.user._id || reader.user
          : reader;
      const userId = user.id || user._id;
      return (
        readerId &&
        userId &&
        (readerId.toString() === userId.toString() ||
          (typeof reader === 'object' && reader.isCurrentlyReading))
      );
    });
  };

  const getDescription = (book) => {
    const desc = (book.shortDescription || '').trim();
    if (desc) return desc;

    const content = (book.content || '').trim();
    if (!content) return 'No description yet.';

    // Light teaser without full plot
    const snippet = content.slice(0, 180);
    return snippet.length < content.length ? `${snippet}...` : snippet;
  };

  return (
    <div className="App">
      <NewHeader />
      <main className="all-books-main">
        <section className="all-books-hero">
          <h1>Explore all books</h1>
          <p>Browse every story, including older ones.</p>
        </section>

        {loading && <Loading message="Loading books..." />}

        {!loading && books.length === 0 ? (
          <p className="empty-message">No books available yet.</p>
        ) : (
          <div className="all-books-grid">
            {books.map((book) => {
              const title = book.title || 'Untitled';
              const genre = book.genre || 'Genre';
              const reading = isUserReadingBook(book);
              const author = book.authorName || book.author?.name || 'Unknown author';
              return (
                <div key={book._id} className="book-mini-card">
                  <div className="book-mini-header">
                    <h3 className="book-mini-title">{title}</h3>
                    <span className="book-mini-genre">{genre}</span>
                  </div>
                  <p className="book-mini-desc">{getDescription(book)}</p>
                  <p className="book-mini-author">By {author}</p>
                  <div className="book-mini-actions">
                    <button
                      className="btn-mini"
                      onClick={() => (reading ? handleStopReading(book._id) : handleStartReading(book._id))}
                    >
                      {reading ? '✓ Reading' : 'Read'}
                    </button>
                    <button className="btn-mini ghost" onClick={() => handleShareBook(book._id)}>
                      Share
                    </button>
                    <button
                      className="btn-mini primary"
                      onClick={() => window.location.assign(`/book/${book._id}`)}
                    >
                      Open
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllBooksPage;

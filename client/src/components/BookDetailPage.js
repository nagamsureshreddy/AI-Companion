import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NewHeader from './NewHeader';
import './BookDetailPage.css';
import { bookService } from '../services/api';

const BookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await bookService.getById(id);
        setBook(response.data);
      } catch (err) {
        setError('Unable to load book.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) return <div className="detail-loading">Loading...</div>;
  if (error) return <div className="detail-error">{error}</div>;
  if (!book) return null;

  return (
    <div className="App">
      <NewHeader />
      <main className="detail-main">
        <section className="detail-hero">
          <h1>{book.title}</h1>
          <p className="detail-genre">{book.genre}</p>
          {book.imageUrl && (
            <div className="detail-image-wrapper">
              <img src={book.imageUrl} alt={book.title} className="detail-image" />
            </div>
          )}
          <p className="detail-author">By {book.authorName || book.author?.name || 'Unknown author'}</p>
        </section>
        <section className="detail-body">
          {book.shortDescription && (
            <div className="detail-block">
              <h3>Short description</h3>
              <p>{book.shortDescription}</p>
            </div>
          )}
          <div className="detail-block">
            <h3>Long Description</h3>
            <p className="detail-content">
              {book.content}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BookDetailPage;






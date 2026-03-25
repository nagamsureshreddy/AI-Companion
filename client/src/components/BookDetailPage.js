import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NewHeader from './NewHeader';
import './BookDetailPage.css';
import { bookService } from '../services/api';
import { getErrorMessage } from '../utils/helpers';

const BookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewInput, setReviewInput] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await bookService.getById(id);
        setBook(response.data);
        const rev = await bookService.getReviews(id);
        setReviews(rev.data || []);
      } catch (err) {
        setError('Unable to load book.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!ratingInput) return;
    try {
      setSubmitting(true);
      await bookService.rateBook(id, Number(ratingInput), reviewInput);
      const rev = await bookService.getReviews(id);
      setReviews(rev.data || []);
      setReviewInput('');
      setRatingInput(5);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

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
          <div className="detail-block" id="reviews">
            <h3>Reviews</h3>
            <form className="review-form" onSubmit={handleSubmitReview}>
              <label>
                Rating
                <select
                  value={ratingInput}
                  onChange={(e) => setRatingInput(e.target.value)}
                  disabled={submitting}
                >
                  {[5,4,3,2,1].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </label>
              <label>
                Your review (optional)
                <textarea
                  value={reviewInput}
                  onChange={(e) => setReviewInput(e.target.value)}
                  rows="3"
                  placeholder="Share your thoughts..."
                  disabled={submitting}
                />
              </label>
              <button type="submit" disabled={submitting} className="review-submit">
                {submitting ? 'Submitting...' : 'Submit review'}
              </button>
            </form>
            {!reviews || reviews.length === 0 ? (
              <p className="detail-muted">No reviews yet.</p>
            ) : (
              <div className="reviews-list">
                {reviews.map((r, idx) => (
                  <div key={idx} className="review-item">
                    <p className="review-rating">⭐ {r.rating}</p>
                    {r.review && <p className="review-text">{r.review}</p>}
                    <p className="review-meta">
                      {r.user?.name || r.user || 'Anonymous'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BookDetailPage;






import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import NewHeader from './NewHeader';
import './BookDetailPage.css';
import { bookService } from '../services/api';
import { getErrorMessage } from '../utils/helpers';

const BookDetailPage = () => {
  const { id } = useParams();
  const { hash } = useLocation();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewInput, setReviewInput] = useState('');

  const ratingStats = (() => {
    if (!reviews || reviews.length === 0) {
      return { avg: 0, count: 0, buckets: [0, 0, 0, 0, 0] };
    }
    const count = reviews.length;
    const total = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
    const avg = (total / count).toFixed(1);
    const buckets = [0, 0, 0, 0, 0]; // index 0 -> 1 star
    reviews.forEach((r) => {
      const v = Math.min(5, Math.max(1, Number(r.rating || 0)));
      buckets[v - 1] += 1;
    });
    return { avg, count, buckets };
  })();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await bookService.getById(id);
        setBook(response.data);
        const rev = await bookService.getReviews(id);
        const list = Array.isArray(rev.data) ? rev.data : [];
        setReviews(list);
      } catch (err) {
        setError('Unable to load book.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  // Scroll to anchored section (e.g., #reviews) after data is loaded
  useEffect(() => {
    if (!hash) return;
    // slight delay to allow render
    const t = setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
    return () => clearTimeout(t);
  }, [hash, book]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!ratingInput) return;
    try {
      setSubmitting(true);
      await bookService.rateBook(id, Number(ratingInput), reviewInput);
      const rev = await bookService.getReviews(id);
      const list = Array.isArray(rev.data) ? rev.data : [];
      setReviews(list);
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
          <div className="review-hero" id="reviews">
            <div className="review-hero-left">
              <p className="review-kicker">Reviews</p>
              <h3 className="review-title">{book.title}</h3>
              <p className="review-subtitle">Share your rating and thoughts.</p>
            </div>
            <div className="review-hero-right">
              <div className="score-card">
                <p className="score-label">User Score</p>
                <div className="score-value">{ratingStats.count ? ratingStats.avg : '–'}</div>
                <p className="score-meta">Based on {ratingStats.count} ratings</p>
              </div>
              <div className="score-distribution">
                {[5,4,3,2,1].map((star, idx) => {
                  const bucket = ratingStats.buckets[star - 1] || 0;
                  const pct = ratingStats.count ? Math.round((bucket / ratingStats.count) * 100) : 0;
                  return (
                    <div key={star} className="dist-row">
                      <span className="dist-label">{star}★</span>
                      <div className="dist-bar">
                        <div className="dist-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="dist-count">{bucket}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="detail-block">
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






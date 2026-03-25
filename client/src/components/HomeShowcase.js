import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomeShowcase.css';

const placeholder =
  'https://via.placeholder.com/400x250.png?text=Book+Cover';

const HomeShowcase = ({
  books = [],
  loading = false,
  onStartReading,
  onStopReading,
  onShare,
  onCreateBook,
  isUserReadingBook,
}) => {
  const navigate = useNavigate();

  const {
    featured,
    topBooks,
    exploreBooks,
    genres,
  } = useMemo(() => {
    const withRating = [...books].sort((a, b) => {
      const aR = Number(a.averageRating || 0);
      const bR = Number(b.averageRating || 0);
      if (bR !== aR) return bR - aR;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    const byRecent = [...books].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );

    const uniqueGenres = Array.from(
      new Set(
        books
          .map((b) => b.genre)
          .filter(Boolean)
      )
    ).slice(0, 8);

    return {
      featured: byRecent.slice(0, 4),
      topBooks: withRating.slice(0, 6),
      exploreBooks: byRecent.slice(0, 10),
      genres: uniqueGenres,
    };
  }, [books]);

  const renderHero = () => {
    const hero = featured[0];
    if (!hero) return null;
    return (
      <section className="hs-hero">
        <div className="hs-hero-bg">
          <img src={hero.imageUrl || placeholder} alt={hero.title} />
          <div className="hs-hero-overlay" />
        </div>
        <div className="hs-hero-content">
          <p className="hs-kicker">Featured story</p>
          <h1>{hero.title}</h1>
          <p className="hs-hero-desc">
            {hero.shortDescription || 'Dive into this featured book.'}
          </p>
          <div className="hs-hero-actions">
            <Link className="hs-btn primary" to={`/book/${hero._id}`}>
              Read now
            </Link>
            <Link className="hs-btn ghost" to="/create-story">
              Create a book
            </Link>
          </div>
        </div>
        {featured.slice(1, 4).length > 0 && (
          <div className="hs-hero-thumbs">
            {featured.slice(1, 4).map((b) => (
              <button
                key={b._id}
                className="hs-thumb"
                onClick={() => navigate(`/book/${b._id}`)}
              >
                <img src={b.imageUrl || placeholder} alt={b.title} />
                <div className="hs-thumb-info">
                  <p className="hs-thumb-title">{b.title}</p>
                  <p className="hs-thumb-genre">{b.genre}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    );
  };

  const renderTopGrid = () => {
    if (loading) return <p className="hs-muted">Loading books...</p>;
    if (!topBooks.length) return <p className="hs-muted">No books yet.</p>;

    return (
      <section className="hs-section">
        <div className="hs-section-header">
          <h2>Top books this week</h2>
          <Link to="/books" className="hs-link">
            See all
          </Link>
        </div>
        <div className="hs-top-grid">
          {topBooks.map((book, idx) => {
            const rating = book.averageRating || '–';
            return (
              <div key={book._id} className="hs-top-card">
                <div className="hs-rank-badge">#{idx + 1}</div>
                <div className="hs-card-body">
                  <img
                    src={book.imageUrl || placeholder}
                    alt={book.title}
                    className="hs-cover"
                  />
                  <div className="hs-card-meta">
                    <p className="hs-card-title">{book.title}</p>
                    <p className="hs-card-genre">{book.genre}</p>
                    <p className="hs-card-rating">⭐ {rating}</p>
                    <div className="hs-card-actions">
                      <Link className="hs-btn link" to={`/book/${book._id}`}>
                        Read
                      </Link>
                      {onShare && (
                        <button
                          className="hs-btn ghost"
                          onClick={() => onShare(book._id)}
                        >
                          Share
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderExplore = () => {
    if (!exploreBooks.length) return null;
    return (
      <section className="hs-section">
        <div className="hs-section-header">
          <h2>Explore books</h2>
          <Link to="/books" className="hs-link">
            Explore all
          </Link>
        </div>
        <div className="hs-carousel">
          {exploreBooks.map((book) => {
            const reading = isUserReadingBook ? isUserReadingBook(book) : false;
            return (
              <div key={book._id} className="hs-carousel-card">
                <img
                  src={book.imageUrl || placeholder}
                  alt={book.title}
                  className="hs-carousel-cover"
                />
                <p className="hs-carousel-title">{book.title}</p>
                <p className="hs-carousel-genre">{book.genre}</p>
                <p className="hs-carousel-rating">
                  ⭐ {book.averageRating || '–'}
                </p>
                <div className="hs-carousel-actions">
                  {onStartReading && onStopReading && (
                    <button
                      className="hs-btn primary"
                      onClick={() =>
                        reading
                          ? onStopReading(book._id)
                          : onStartReading(book._id)
                      }
                    >
                      {reading ? '✓ Reading' : 'Read'}
                    </button>
                  )}
                  <Link className="hs-btn link" to={`/book/${book._id}`}>
                    Open
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderGenres = () => {
    if (!genres.length) return null;
    return (
      <section className="hs-section">
        <div className="hs-section-header">
          <h2>Popular genres</h2>
        </div>
        <div className="hs-genre-row">
          {genres.map((g) => (
            <Link key={g} to="/books" className="hs-genre-chip">
              {g}
            </Link>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="hs-wrapper">
      {renderHero()}
      {renderTopGrid()}
      {renderExplore()}
      {renderGenres()}
    </div>
  );
};

export default HomeShowcase;

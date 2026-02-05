import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateBook from './CreateBook';
import './GenreSection.css';

const GenreSection = ({ onCreateBook, loading }) => {
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleBookCreated = (bookData, imageFile) => {
    onCreateBook({ ...bookData, genre: selectedGenre }, imageFile);
    setShowCreateForm(false);
    setSelectedGenre(null);
  };

  if (showCreateForm) {
    return (
      <section className="genre-section">
        <div className="section-content">
          <div className="standalone-cta">
            <div className="cta-text">
              <h2>Create your story</h2>
              <p>Start with a title, pick a genre, and craft your book.</p>
            </div>
            <button
              className="create-story-btn"
              onClick={() => navigate('/create-story')}
            >
              Create your story
            </button>
          </div>
          <CreateBook 
            onCreateBook={handleBookCreated} 
            loading={loading}
            defaultGenre={selectedGenre}
            onCancel={() => {
              setShowCreateForm(false);
              setSelectedGenre(null);
            }}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="genre-section">
      <div className="section-content">
        <div className="standalone-cta">
          <div className="cta-text">
            <h2>Create your story</h2>
            <p>Start with a title, pick a genre, and craft your book.</p>
          </div>
          <button
            className="create-story-btn"
            onClick={() => navigate('/create-story')}
          >
            Create your story
          </button>
        </div>
      </div>
    </section>
  );
};

export default GenreSection;







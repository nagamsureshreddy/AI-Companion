import React, { useState } from 'react';
import './CreateBook.css';

const GENRES = [
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
];

const CreateBook = ({ onCreateBook, loading, defaultGenre, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    content: '',
    genre: defaultGenre || 'Fiction',
  });
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.content.trim()) {
      onCreateBook(formData, imageFile);
      setFormData({ title: '', shortDescription: '', content: '', genre: 'Fiction' });
      setImageFile(null);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="create-book-container">
      <h2>Create New Book</h2>
      <p className="create-book-hint">
        Type a sentence and it will automatically become a book!
      </p>
      <form onSubmit={handleSubmit} className="create-book-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a title for your book"
          />
        </div>

        <div className="form-group">
          <label htmlFor="genre">Genre:</label>
          <select
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="genre-select"
          >
            {GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="shortDescription">Short Description:</label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            placeholder="One or two sentences to summarize your book"
            rows="2"
            className="book-content-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageFile">Image (optional):</label>
          <input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Book Content (Sentence):</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write a sentence to create your book..."
            required
            rows="4"
            className="book-content-input"
          />
          <small className="char-count">
            {formData.content.length} characters
          </small>
        </div>
        
        <div className="form-actions">
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel} 
              className="btn-cancel"
            >
              Cancel
            </button>
          )}
          <button type="submit" disabled={loading || !formData.content.trim()} className="btn-create-book">
            {loading ? 'Creating...' : '✨ Create Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBook;


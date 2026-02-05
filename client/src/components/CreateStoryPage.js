import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewHeader from './NewHeader';
import './CreateStoryPage.css';
import { bookService } from '../services/api';
import { getErrorMessage } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const GENRES = [
  'Thriller',
  'Comedy',
  'History',
  'Suspense',
  'Fiction',
  'Romance',
  'Mystery',
  'Fantasy',
  'Non-Fiction',
  'Science Fiction',
  'Horror',
  'Biography',
  'Poetry',
  'Drama',
  'Adventure',
  'Other',
];

const CreateStoryPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    genre: '',
    shortDescription: '',
    pages: 1,
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    // redirect unauthenticated users to login
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to create a story.');
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        title: form.title,
        shortDescription: form.shortDescription,
        genre: form.genre || 'Fiction',
        pages: Number(form.pages) || 1,
      };

      // Generate story content via backend AI
      const generated = await bookService.generateStory(payload);
      const content = generated?.data?.content || form.shortDescription || form.title;

      const created = await bookService.create({
        title: form.title,
        genre: form.genre || 'Fiction',
        content,
        shortDescription: form.shortDescription,
      });

      // Upload image if provided
      if (imageFile && created?.data?._id) {
        try {
          await bookService.uploadImage(created.data._id, imageFile);
        } catch (uploadErr) {
          console.error('Image upload failed:', uploadErr);
        }
      }
      alert('Story created successfully!');
      navigate('/');
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <NewHeader />
      <main className="create-story-main">
        <section className="create-story-hero">
          <p className="hero-text">
            Bring your creativity and create the book. Craft a title, choose a genre, and add your story.
          </p>
        </section>

        <section className="create-story-form-section">
          <div className="form-card">
            <h2>Create your story</h2>
            <form className="create-story-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter a compelling title"
                />
              </div>

              <div className="form-group">
                <label>Choose genre</label>
                <select
                  name="genre"
                  value={form.genre}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Short description</label>
                <textarea
                  name="shortDescription"
                  value={form.shortDescription}
                  onChange={handleChange}
                  rows="3"
                  placeholder="One or two sentences to summarize your story"
                />
              </div>

              <div className="form-group">
                <label>Number of pages</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  name="pages"
                  value={form.pages}
                  onChange={handleChange}
                  required
                  placeholder="Choose how many pages to generate"
                />
              </div>

              <div className="form-group">
                <label>Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0] || null)}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CreateStoryPage;


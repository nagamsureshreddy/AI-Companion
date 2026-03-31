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
    pages: 1,
  });
  const [pageDescriptions, setPageDescriptions] = useState(['']);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    // redirect unauthenticated users to login
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'pages') {
      const pages = Math.max(1, Math.min(20, Number(value) || 1));
      setForm((prev) => ({ ...prev, pages }));
      setPageDescriptions((prev) => {
        const next = [...prev];
        if (pages > next.length) {
          while (next.length < pages) next.push('');
        } else if (pages < next.length) {
          next.length = pages;
        }
        return next;
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePageDescriptionChange = (idx, value) => {
    setPageDescriptions((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
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
        genre: form.genre || 'Fiction',
        pages: Number(form.pages) || 1,
        pageDescriptions,
      };

      // Generate story content via backend AI
      const generated = await bookService.generateStory(payload);
      const content =
        generated?.data?.content ||
        pageDescriptions.join('\n\n') ||
        form.title;

      const created = await bookService.create({
        title: form.title,
        genre: form.genre || 'Fiction',
        content,
        shortDescription: pageDescriptions[0] || '',
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
            Provide a per-page outline (4-5 lines each). The AI will write a complete story with the desired number of pages.
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

              {pageDescriptions.map((desc, idx) => (
                <div className="form-group" key={idx}>
                  <label>Page {idx + 1} description</label>
                  <textarea
                    value={desc}
                    onChange={(e) => handlePageDescriptionChange(idx, e.target.value)}
                    rows="3"
                    placeholder="Describe this page (4-5 lines)."
                    required
                  />
                </div>
              ))}

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


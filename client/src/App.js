import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import NewHeader from './components/NewHeader';
import HeroSection from './components/HeroSection';
import AuthSection from './components/AuthSection';
import GenreSection from './components/GenreSection';
import BookExplorationSection from './components/BookExplorationSection';
import TestimonialsSection from './components/TestimonialsSection';
import CreateStoryPage from './components/CreateStoryPage';
import BookDetailPage from './components/BookDetailPage';
import { bookService } from './services/api';
import { getErrorMessage } from './utils/helpers';
import './App.css';

// Landing page (home) without auth form
function LandingPage() {
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
      setBooks(response.data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBook = async (bookData, imageFile) => {
    try {
      setLoading(true);
      const created = await bookService.create(bookData);
      if (imageFile && created?.data?._id) {
        try {
          await bookService.uploadImage(created.data._id, imageFile);
        } catch (uploadErr) {
          console.error('Image upload failed:', uploadErr);
        }
      }
      alert('Book created successfully!');
      fetchBooks();
    } catch (error) {
      console.error('Error creating book:', error);
      alert('Error creating book: ' + getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleStartReading = async (bookId) => {
    try {
      await bookService.startReading(bookId);
      fetchBooks();
    } catch (error) {
      console.error('Error starting to read:', error);
      alert('Error: ' + getErrorMessage(error));
    }
  };

  const handleStopReading = async (bookId) => {
    try {
      await bookService.stopReading(bookId);
      fetchBooks();
    } catch (error) {
      console.error('Error stopping reading:', error);
      alert('Error: ' + getErrorMessage(error));
    }
  };

  const handleShareBook = async (bookId) => {
    try {
      await bookService.shareBook(bookId);
      alert('Book shared successfully!');
      fetchBooks();
    } catch (error) {
      console.error('Error sharing book:', error);
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

  return (
    <div className="App">
      <NewHeader />
      <main className="main-content">
        <HeroSection />
        <GenreSection onCreateBook={handleCreateBook} loading={loading} />
        <BookExplorationSection
          books={books}
          loading={loading}
          onStartReading={handleStartReading}
          onStopReading={handleStopReading}
          onShare={handleShareBook}
          isUserReadingBook={isUserReadingBook}
        />
        <TestimonialsSection />
      </main>
    </div>
  );
}

// Dedicated signup/login page
function SignupPage() {
  return (
    <div className="App">
      <NewHeader />
      <main className="main-content">
        <HeroSection />
        <AuthSection />
      </main>
    </div>
  );
}

// Dedicated login page
function LoginPage() {
  return (
    <div className="App">
      <NewHeader />
      <main className="main-content">
        <HeroSection />
        <AuthSection defaultMode="login" />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-story" element={<CreateStoryPage />} />
          <Route path="/book/:id" element={<BookDetailPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

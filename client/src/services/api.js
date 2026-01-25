import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service methods
export const healthCheck = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

export const userService = {
  // Get all users
  getAll: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },

  // Get user by ID
  getById: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/api/users/me');
    return response.data;
  },

  // Create user
  create: async (userData) => {
    const response = await api.post('/api/users', userData);
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/api/users/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/api/users/login', credentials);
    return response.data;
  },
};

export const bookService = {
  // Get all books
  getAll: async (params = {}) => {
    const response = await api.get('/api/books', { params });
    return response.data;
  },

  // Get book by ID
  getById: async (id) => {
    const response = await api.get(`/api/books/${id}`);
    return response.data;
  },

  // Get my books (author only)
  getMyBooks: async () => {
    const response = await api.get('/api/books/my-books');
    return response.data;
  },

  // Create book (author only)
  create: async (bookData) => {
    const response = await api.post('/api/books', bookData);
    return response.data;
  },

  // Update book (author only)
  update: async (id, bookData) => {
    const response = await api.put(`/api/books/${id}`, bookData);
    return response.data;
  },

  // Delete book (author only)
  delete: async (id) => {
    const response = await api.delete(`/api/books/${id}`);
    return response.data;
  },

  // Start reading a book (reader only)
  startReading: async (id) => {
    const response = await api.post(`/api/books/${id}/start-reading`);
    return response.data;
  },

  // Stop reading a book (reader only)
  stopReading: async (id) => {
    const response = await api.post(`/api/books/${id}/stop-reading`);
    return response.data;
  },

  // Rate a book
  rateBook: async (id, rating, review) => {
    const response = await api.post(`/api/books/${id}/rate`, { rating, review });
    return response.data;
  },

  // Get book reviews
  getReviews: async (id) => {
    const response = await api.get(`/api/books/${id}/reviews`);
    return response.data;
  },

  // Get trending books
  getTrending: async (limit = 10) => {
    const response = await api.get('/api/books/trending', { params: { limit } });
    return response.data;
  },

  // Get popular books
  getPopular: async (limit = 10) => {
    const response = await api.get('/api/books/popular', { params: { limit } });
    return response.data;
  },

  // Share a book
  shareBook: async (id) => {
    const response = await api.post(`/api/books/${id}/share`);
    return response.data;
  },

  // Get book statistics
  getStats: async () => {
    const response = await api.get('/api/books/stats');
    return response.data;
  },

  // Upload book image (GridFS)
  uploadImage: async (bookId, file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post(`/api/books/${bookId}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Generate story via backend (Deepseek)
  generateStory: async (payload) => {
    const response = await api.post('/api/generate/story', payload);
    return response.data;
  },
};

export default api;


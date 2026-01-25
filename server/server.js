const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Connect to database
connectDB();

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5000',
  'http://localhost:5000',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      books: '/api/books',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Import routes
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const generateRoutes = require('./routes/generateRoutes');
const bookImageRoutes = require('./routes/bookImageRoutes');
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/books', bookImageRoutes); // image upload/serve

// Error handling middleware (must be after routes)
app.use(errorHandler);

// 404 handler (must be after all routes)
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  logger.success(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});


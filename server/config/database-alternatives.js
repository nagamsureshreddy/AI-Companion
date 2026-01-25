/**
 * ALTERNATIVE DATABASE CONNECTION METHODS
 * 
 * This file contains examples of different ways to connect to MongoDB.
 * Uncomment and use the method that suits your needs.
 */

const mongoose = require('mongoose');

// ============================================
// METHOD 1: Current Implementation (Recommended)
// ============================================
const connectDB_Current = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// ============================================
// METHOD 2: With Advanced Connection Options
// ============================================
const connectDB_WithOptions = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
      // Connection Pool Settings
      maxPoolSize: 10,              // Maximum number of connections
      minPoolSize: 5,               // Minimum number of connections
      
      // Timeout Settings
      serverSelectionTimeoutMS: 5000,  // How long to wait for server selection
      socketTimeoutMS: 45000,          // How long to wait for a socket
      connectTimeoutMS: 30000,          // How long to wait for initial connection
      
      // Write Concern
      retryWrites: true,
      w: 'majority',
      
      // Buffer Settings
      bufferCommands: false,        // Disable buffering
      bufferMaxEntries: 0,          // Disable mongoose buffering
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// ============================================
// METHOD 3: With Retry Logic
// ============================================
const connectDB_WithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });

      console.log(`MongoDB Connected (Attempt ${i + 1}): ${conn.connection.host}`);
      
      // Set up automatic reconnection on disconnect
      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected. Attempting to reconnect...');
        setTimeout(() => connectDB_WithRetry(retries, delay), delay);
      });

      return conn;
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) {
        console.error('Max retries reached. Exiting...');
        process.exit(1);
      }
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// ============================================
// METHOD 4: Environment-Based Configuration
// ============================================
const getConnectionConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  const configs = {
    development: {
      uri: process.env.MONGODB_URI,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
      }
    },
    production: {
      uri: process.env.MONGODB_URI,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 20,
        minPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: 'majority',
      }
    },
    test: {
      uri: process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/test',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    }
  };

  return configs[env] || configs.development;
};

const connectDB_EnvironmentBased = async () => {
  try {
    const config = getConnectionConfig();
    const conn = await mongoose.connect(config.uri, config.options);
    console.log(`MongoDB Connected (${process.env.NODE_ENV}): ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// ============================================
// METHOD 5: With Connection Events
// ============================================
const connectDB_WithEvents = async () => {
  try {
    // Set up event listeners before connecting
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    // Connect to database
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// ============================================
// METHOD 6: With Separate Connection Parameters
// ============================================
const connectDB_SeparateParams = async () => {
  try {
    // Build connection string from separate parameters
    const host = process.env.MONGODB_HOST || 'localhost';
    const port = process.env.MONGODB_PORT || 27017;
    const database = process.env.MONGODB_DATABASE || 'AICompanion';
    const username = process.env.MONGODB_USERNAME;
    const password = process.env.MONGODB_PASSWORD;

    let connectionString;
    if (username && password) {
      // For MongoDB Atlas or authenticated local MongoDB
      connectionString = `mongodb+srv://${username}:${encodeURIComponent(password)}@${host}/${database}?retryWrites=true&w=majority`;
    } else {
      // For local MongoDB without authentication
      connectionString = `mongodb://${host}:${port}/${database}`;
    }

    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Export the method you want to use
// Currently using the standard method
module.exports = connectDB_Current;

// To use a different method, change the export above:
// module.exports = connectDB_WithOptions;
// module.exports = connectDB_WithRetry;
// module.exports = connectDB_EnvironmentBased;
// module.exports = connectDB_WithEvents;
// module.exports = connectDB_SeparateParams;





















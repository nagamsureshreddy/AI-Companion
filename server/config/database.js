const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  MONGODB_URI is not defined in .env file');
      console.warn('⚠️  Please add your MongoDB connection string to continue');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    // Don't exit the process, just log the error
    console.log('Server will continue running without database connection');
  }
};

module.exports = connectDB;


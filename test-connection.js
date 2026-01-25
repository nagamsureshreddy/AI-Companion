/**
 * Database Connection Test Script
 * This script will attempt to connect to MongoDB and report success or failure
 */

require('dotenv').config();
const mongoose = require('mongoose');

console.log('='.repeat(50));
console.log('Testing MongoDB Connection...');
console.log('='.repeat(50));
console.log('');

// Display connection info (without password)
const uri = process.env.MONGODB_URI || '';
const maskedUri = uri.replace(/:[^:@]+@/, ':****@');
console.log('Connection String:', maskedUri);
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('');

// Set connection timeout
const connectionTimeout = 10000; // 10 seconds

// Create a promise that will resolve or reject based on connection
const testConnection = () => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Connection timeout after 10 seconds'));
    }, connectionTimeout);

    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: connectionTimeout,
    })
    .then((conn) => {
      clearTimeout(timeout);
      resolve(conn);
    })
    .catch((error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
};

// Run the test
testConnection()
  .then((conn) => {
    console.log('✅ SUCCESS: Database Connected!');
    console.log('');
    console.log('Connection Details:');
    console.log('  - Host:', conn.connection.host);
    console.log('  - Port:', conn.connection.port);
    console.log('  - Database:', conn.connection.name);
    console.log('  - Ready State:', conn.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    console.log('');
    console.log('='.repeat(50));
    
    // Close connection
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ FAILED: Database Connection Failed!');
    console.log('');
    console.log('Error Details:');
    console.log('  - Error Message:', error.message);
    console.log('');
    
    // Common error messages and solutions
    if (error.message.includes('authentication failed')) {
      console.log('💡 Solution: Check your MongoDB username and password');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.log('💡 Solution: Check your internet connection and MongoDB URI');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Solution: Check your network connection or MongoDB server status');
    } else if (error.message.includes('MongoParseError')) {
      console.log('💡 Solution: Check your MongoDB URI format');
    } else if (error.message.includes('IP')) {
      console.log('💡 Solution: Add your IP address to MongoDB Atlas whitelist');
    }
    
    console.log('');
    console.log('='.repeat(50));
    process.exit(1);
  });





















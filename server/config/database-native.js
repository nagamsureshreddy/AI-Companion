/**
 * NATIVE MONGODB DRIVER CONNECTION
 * 
 * This example shows how to connect using the native MongoDB driver
 * instead of Mongoose. This gives you more control but requires more
 * manual work.
 * 
 * Install: npm install mongodb
 */

const { MongoClient } = require('mongodb');

let client;
let db;

const connectDB = async () => {
  try {
    // Create MongoDB client
    client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    // Connect to MongoDB
    await client.connect();
    
    // Get database instance
    // Extract database name from URI or use default
    const dbName = process.env.MONGODB_DATABASE || 'AICompanion';
    db = client.db(dbName);
    
    console.log('MongoDB Connected (Native Driver)');
    console.log(`Database: ${db.databaseName}`);
    
    // Set up event listeners
    client.on('connectionPoolCreated', () => {
      console.log('Connection pool created');
    });

    client.on('connectionCreated', () => {
      console.log('New connection created');
    });

    client.on('connectionClosed', () => {
      console.log('Connection closed');
    });

    return { client, db };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Helper function to get database instance
const getDB = () => {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return db;
};

// Helper function to get client instance
const getClient = () => {
  if (!client) {
    throw new Error('Client not connected. Call connectDB() first.');
  }
  return client;
};

// Example: Get users collection
const getUsers = async () => {
  try {
    const collection = db.collection('users');
    const users = await collection.find({}).toArray();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Example: Create a user
const createUser = async (userData) => {
  try {
    const collection = db.collection('users');
    const result = await collection.insertOne(userData);
    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Graceful shutdown
const closeConnection = async () => {
  try {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  } catch (error) {
    console.error('Error closing connection:', error);
  }
};

// Handle app termination
process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeConnection();
  process.exit(0);
});

module.exports = {
  connectDB,
  getDB,
  getClient,
  getUsers,
  createUser,
  closeConnection,
};





















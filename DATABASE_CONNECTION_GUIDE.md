# Database Connection Methods Guide

This guide explains different ways to connect to MongoDB in Node.js applications.

## Current Implementation (Method 1: Mongoose with Connection String)

**Location:** `server/config/database.js`

This is the **recommended approach** for most applications. It uses Mongoose ODM with a connection string from environment variables.

### Advantages:
- ✅ Simple and straightforward
- ✅ Automatic connection pooling
- ✅ Built-in error handling
- ✅ Schema validation
- ✅ Middleware support
- ✅ Production-ready

### Code:
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
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
```

---

## Method 2: Mongoose with Connection Options Object

Instead of a connection string, you can pass connection details as an object:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Connection options
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
      // Connection pool settings
      maxPoolSize: 10,              // Maximum number of connections
      minPoolSize: 5,                // Minimum number of connections
      socketTimeoutMS: 45000,        // How long to wait for a socket
      serverSelectionTimeoutMS: 5000, // How long to wait for server selection
      
      // Authentication
      authSource: 'admin',
      
      // Retry settings
      retryWrites: true,
      w: 'majority',
      
      // Other options
      bufferCommands: false,
      bufferMaxEntries: 0,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};
```

---

## Method 3: Native MongoDB Driver (mongodb package)

Using the official MongoDB driver without Mongoose:

### Install:
```bash
npm install mongodb
```

### Connection Code:
```javascript
const { MongoClient } = require('mongodb');

let client;
let db;

const connectDB = async () => {
  try {
    client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      minPoolSize: 5,
    });

    await client.connect();
    db = client.db('AICompanion'); // Database name
    
    console.log('MongoDB Connected');
    return { client, db };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Usage in routes
const getUsers = async () => {
  const collection = db.collection('users');
  return await collection.find({}).toArray();
};

module.exports = { connectDB, getUsers };
```

### Advantages:
- ✅ More control over queries
- ✅ Lighter weight (no ODM overhead)
- ✅ Direct access to MongoDB features
- ❌ No schema validation
- ❌ More manual work required

---

## Method 4: Connection with Separate Host, Port, Database

If you prefer to specify connection details separately:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoConfig = {
      host: process.env.MONGODB_HOST || 'localhost',
      port: process.env.MONGODB_PORT || 27017,
      database: process.env.MONGODB_DATABASE || 'AICompanion',
      username: process.env.MONGODB_USERNAME,
      password: process.env.MONGODB_PASSWORD,
    };

    // Build connection string
    let connectionString;
    if (mongoConfig.username && mongoConfig.password) {
      connectionString = `mongodb://${mongoConfig.username}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`;
    } else {
      connectionString = `mongodb://${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`;
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
```

---

## Method 5: Connection with Retry Logic

For production applications that need automatic reconnection:

```javascript
const mongoose = require('mongoose');

const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
      
      // Set up automatic reconnection
      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected. Attempting to reconnect...');
        setTimeout(() => connectDB(retries), 5000);
      });

      return conn;
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) {
        console.error('Max retries reached. Exiting...');
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    }
  }
};
```

---

## Method 6: Multiple Database Connections

For applications that need to connect to multiple databases:

```javascript
const mongoose = require('mongoose');

// Primary database connection
const primaryDB = mongoose.createConnection(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Secondary database connection (if needed)
const secondaryDB = mongoose.createConnection(process.env.MONGODB_URI_2, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Event handlers for primary
primaryDB.on('connected', () => {
  console.log('Primary DB Connected');
});

primaryDB.on('error', (err) => {
  console.error('Primary DB Error:', err);
});

// Event handlers for secondary
secondaryDB.on('connected', () => {
  console.log('Secondary DB Connected');
});

// Usage: Create models for specific connections
const User = primaryDB.model('User', userSchema);
const Log = secondaryDB.model('Log', logSchema);

module.exports = { primaryDB, secondaryDB };
```

---

## Method 7: Connection with Environment-Based Configuration

Different connection settings for development, staging, and production:

```javascript
const mongoose = require('mongoose');

const getConnectionConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  const configs = {
    development: {
      uri: process.env.MONGODB_URI_DEV,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 5,
      }
    },
    production: {
      uri: process.env.MONGODB_URI,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 20,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
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

const connectDB = async () => {
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
```

---

## Connection String Formats

### MongoDB Atlas (Cloud):
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Local MongoDB:
```
mongodb://localhost:27017/database
```

### MongoDB with Authentication:
```
mongodb://username:password@host:port/database?authSource=admin
```

### MongoDB Replica Set:
```
mongodb://host1:port1,host2:port2,host3:port3/database?replicaSet=myReplicaSet
```

---

## Connection Options Reference

| Option | Description | Default |
|--------|-------------|---------|
| `useNewUrlParser` | Use new URL parser | true |
| `useUnifiedTopology` | Use unified topology | true |
| `maxPoolSize` | Maximum connections in pool | 100 |
| `minPoolSize` | Minimum connections in pool | 0 |
| `serverSelectionTimeoutMS` | Server selection timeout | 30000 |
| `socketTimeoutMS` | Socket timeout | 360000 |
| `connectTimeoutMS` | Connection timeout | 30000 |
| `retryWrites` | Retry write operations | true |
| `w` | Write concern | 'majority' |
| `bufferCommands` | Buffer commands when disconnected | true |
| `bufferMaxEntries` | Max entries to buffer | 0 (unlimited) |

---

## Best Practices

1. **Use Environment Variables**: Never hardcode connection strings
2. **Connection Pooling**: Let Mongoose handle connection pooling automatically
3. **Error Handling**: Always handle connection errors gracefully
4. **Graceful Shutdown**: Close connections on app termination
5. **Health Checks**: Monitor connection status
6. **Retry Logic**: Implement retry for production applications
7. **Single Connection**: Use one connection per application (Mongoose default)
8. **Connection Events**: Listen to connection events for monitoring

---

## Current Setup Summary

Your current implementation uses **Method 1** (Mongoose with Connection String), which is the **recommended approach** for most Node.js applications. It's:
- ✅ Simple and maintainable
- ✅ Production-ready
- ✅ Well-documented
- ✅ Community-supported

You can enhance it by adding:
- Retry logic (Method 5)
- Environment-based config (Method 7)
- Additional connection options (Method 2)





















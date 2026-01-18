# Database Connection Test Instructions

## To Test the Connection

### 1) Ensure Node.js is installed
- Download LTS from https://nodejs.org/ if needed, then restart your shell.

### 2) Install dependencies
```bash
cd server
npm install
```

### 3) Run the connection test (from project root)
```bash
node test-connection.js
```

## Expected Output

### ✅ If Connection is SUCCESSFUL
```
==================================================
Testing MongoDB Connection...
==================================================
Connection String: mongodb+srv://<user>:****@cluster0aicompanion.etqq4yl.mongodb.net/BookSharing?appName=Cluster0AIcompanion
Environment: development

✅ SUCCESS: Database Connected!

Connection Details:
  - Host: cluster0aicompanion-shard-00-00.etqq4yl.mongodb.net
  - Port: 27017
  - Database: BookSharing
  - Ready State: Connected
==================================================
```

### ❌ If Connection FAILS
```
==================================================
Testing MongoDB Connection...
==================================================
Connection String: mongodb+srv://<user>:****@cluster0aicompanion.etqq4yl.mongodb.net/BookSharing?appName=Cluster0AIcompanion
Environment: development

❌ FAILED: Database Connection Failed!

Error Details:
  - Error Message: [specific error message]

💡 Solution: [helpful solution based on error]
==================================================
```

## Alternative: Test via Server Start
```bash
cd server
npm run dev
```
- ✅ `MongoDB Connected: [hostname]` = SUCCESS
- ❌ `Error connecting to MongoDB: [error]` = FAILED

## Common Issues and Solutions

### 1. Authentication Failed
- **Error**: `authentication failed`
- **Solution**: Verify username and password in `.env`

### 2. Network/Timeout Error
- **Error**: `ENOTFOUND` or `timeout`
- **Solution**: Check internet, ensure MongoDB Atlas cluster is running, and firewall allows access

### 3. IP Whitelist Error
- **Error**: `IP address not whitelisted`
- **Solution**: In MongoDB Atlas → Network Access, add your IP (or `0.0.0.0/0` for testing)

### 4. Connection String Format
- **Error**: `MongoParseError`
- **Solution**: Verify `.env` has a valid `MONGODB_URI`

## Quick Validation
Your `server/.env` should have:
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0aicompanion.etqq4yl.mongodb.net/BookSharing?appName=Cluster0AIcompanion
```





















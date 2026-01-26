# Database Connection Test Instructions

## Current Status

❌ **Cannot test connection automatically** - Node.js is not installed or not in PATH.

## To Test the Connection:

### Step 1: Install Node.js (if not installed)
1. Download Node.js from: https://nodejs.org/
2. Install the LTS version
3. Restart your terminal/PowerShell after installation

### Step 2: Install Dependencies
```bash
cd server
npm install
```

### Step 3: Run Connection Test
From the project root directory:
```bash
node test-connection.js
```

## Expected Output

### ✅ If Connection is SUCCESSFUL:
```
==================================================
Testing MongoDB Connection...
==================================================

Connection String: mongodb+srv://userid:****@cluster0sampledb/...
Environment: development

✅ SUCCESS: Database Connected!

Connection Details:
  - Host: samplehost
  - Port: 12345
  - Database: sampledb
  - Ready State: Connected

==================================================
```

### ❌ If Connection FAILS:
```
==================================================
Testing MongoDB Connection...
==================================================

Connection String: sampledb+srv://userid:****@cluster0sampledb/...
Environment: development

❌ FAILED: Database Connection Failed!

Error Details:
  - Error Message: [specific error message]

💡 Solution: [helpful solution based on error]

==================================================
```

## Alternative: Test via Server Start

You can also test by starting the server:

```bash
cd server
npm run dev
```

If you see:
- ✅ `sampledb Connected: [hostname]` = **SUCCESS**
- ❌ `Error connecting to MongoDB: [error]` = **FAILED**

## Common Issues and Solutions

### 1. Authentication Failed
- **Error**: `authentication failed`
- **Solution**: Verify username and password in `.env` file

### 2. Network/Timeout Error
- **Error**: `ENOTFOUND` or `timeout`
- **Solution**: 
  - Check internet connection
  - Verify MongoDB Atlas cluster is running
  - Check firewall settings

### 3. IP Whitelist Error
- **Error**: `IP address not whitelisted`
- **Solution**: 
  - Go to sampledb Atlas Dashboard
  - Network Access → Add IP Address
  - Add `0.0.0.0/0` for testing (or your specific IP)

### 4. Connection String Format
- **Error**: `dbParseError`
- **Solution**: Verify `.env` file has correct sampledb_URI format

## Quick Validation

Your `.env` file should contain:






















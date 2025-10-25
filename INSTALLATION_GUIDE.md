# AI Companion - Installation Guide

## Complete Setup Instructions for New Machine

Follow these steps to set up the AI Companion application on a different laptop.

## 📋 Prerequisites

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node -v` and `npm -v`

2. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

3. **MongoDB Account** (Already have: Cluster0AIcompanion)
   - Database: AICompanion
   - Collection: users, conversations, userfavorites

---

## 🚀 Installation Steps

### Step 1: Download the Project

Download the complete project folder to your new laptop.

### Step 2: Install Backend Dependencies

Open terminal/command prompt and navigate to the server folder:

```bash
cd server
npm install
```

### Step 3: Configure Environment Variables

1. Go to the `server` folder
2. Create a file named `.env` (if it doesn't exist)
3. Add the following content:

```env
PORT=5001
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://SureshNagam:Fornow%401@cluster0aicompanion.etqq4yl.mongodb.net/AICompanion?retryWrites=true&w=majority&appName=Cluster0AIcompanion

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
JWT_EXPIRE=7d

# CORS - Frontend on port 5000
CLIENT_URL=http://localhost:5000
```

**⚠️ Important:** Keep your MongoDB credentials secure!

### Step 4: Install Frontend Dependencies

Open a NEW terminal window and navigate to the client folder:

```bash
cd client
npm install
```

### Step 5: Start the Backend Server

In the first terminal (server folder):

```bash
cd server
npm start
```

You should see:
```
Server running in development mode on port 5001
✅ MongoDB Connected: ac-lisuzmn-shard-00-01.etqq4yl.mongodb.net
```

### Step 6: Start the Frontend

In the second terminal (client folder):

```bash
cd client
npm start
```

The React app will automatically open in your browser at `http://localhost:5000`

---

## 📁 Project Structure

```
AI Companion/
├── server/                 # Backend (Node.js/Express)
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── .env              # Environment variables
│   ├── server.js         # Entry point
│   └── package.json      # Dependencies
│
├── client/                # Frontend (React)
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── context/      # Auth context
│   │   ├── App.js
│   │   └── index.js
│   ├── .env             # Frontend config
│   └── package.json
│
├── README.md
├── SETUP.md
└── INSTALLATION_GUIDE.md (this file)
```

---

## 🔐 Important Configuration Files

### Server Configuration (server/.env)
- **PORT**: 5001
- **MONGODB_URI**: Your MongoDB connection string
- **JWT_SECRET**: Secret key for authentication

### Frontend Configuration (client/.env)
- **PORT**: 5000
- **proxy**: http://localhost:5001

---

## ✅ Verification

After installation, verify everything is working:

1. **Backend Health Check:**
   ```
   Open browser: http://localhost:5001/api/health
   Should see: {"status":"success",...}
   ```

2. **Frontend:**
   ```
   Open browser: http://localhost:5000
   Should see: AI Companion login page
   ```

3. **Test Registration:**
   - Click "Register here"
   - Create a test account
   - Login
   - Check Dashboard

---

## 🛠️ Troubleshooting

### Port Already in Use

If you get "address already in use" error:

**Mac/Linux:**
```bash
# Find process using port 5001
lsof -ti:5001 | xargs kill -9

# Or kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**Windows:**
```bash
# Find process
netstat -ano | findstr :5001

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### MongoDB Connection Issues

1. Check your internet connection
2. Verify MongoDB Atlas IP whitelist (should be 0.0.0.0/0 for testing)
3. Check MongoDB credentials in `.env` file
4. Verify database name is `AICompanion`

### React Scripts Not Found

```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

### Module Not Found Errors

```bash
# In server folder
cd server
npm install

# In client folder
cd client
npm install
```

---

## 🌐 Ports Used

- **Frontend (React)**: http://localhost:5000
- **Backend (API)**: http://localhost:5001
- **MongoDB**: Atlas Cloud (No local installation needed)

---

## 📝 Available Scripts

### Backend (server/)
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

### Frontend (client/)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

---

## 🔄 Development Workflow

1. Open **two terminal windows**
2. Terminal 1: `cd server && npm start` (Backend)
3. Terminal 2: `cd client && npm start` (Frontend)
4. Both should stay running while developing
5. Changes to backend require restart (Ctrl+C, then npm start)
6. Changes to frontend auto-reload

---

## 📧 Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check the README.md for detailed documentation

---

## ✅ Quick Start Checklist

- [ ] Node.js installed
- [ ] Downloaded project files
- [ ] Installed backend dependencies (`cd server && npm install`)
- [ ] Created server/.env file with MongoDB credentials
- [ ] Installed frontend dependencies (`cd client && npm install`)
- [ ] Started backend server (port 5001)
- [ ] Started frontend server (port 5000)
- [ ] Verified MongoDB connection
- [ ] Tested registration and login

---

**Last Updated:** 2025-01-25
**Version:** 1.0.0

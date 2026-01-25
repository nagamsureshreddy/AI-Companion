# Setup Guide - Node.js + React.js + MongoDB Application

This guide will help you set up and run the full-stack application.

## Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)

## Project Structure

```
node-react-mongodb-app/
├── server/                 # Node.js Backend
│   ├── config/            # Configuration files
│   │   └── database.js    # MongoDB connection
│   ├── controllers/       # Route controllers
│   │   └── userController.js
│   ├── middleware/        # Express middleware
│   │   ├── auth.js        # Authentication middleware
│   │   ├── asyncHandler.js
│   │   └── errorHandler.js
│   ├── models/           # Mongoose models
│   │   └── User.js
│   ├── routes/           # API routes
│   │   └── userRoutes.js
│   ├── utils/            # Utility functions
│   │   ├── logger.js
│   │   └── validators.js
│   ├── .env.example      # Environment variables template
│   ├── package.json
│   └── server.js         # Entry point
│
├── client/               # React Frontend
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React Context
│   │   ├── services/    # API services
│   │   ├── utils/       # Helper functions
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example     # Environment variables template
│   └── package.json
│
├── .gitignore
├── package.json         # Root package.json
└── SETUP_GUIDE.md      # This file

```

## Step-by-Step Setup

### 1. Install Dependencies

#### Option A: Install all at once (from root)
```bash
npm run install-all
```

#### Option B: Install separately
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

#### Backend (.env file)

Create a `.env` file in the `server/` directory:

```bash
cd server
cp env.example .env
```

Edit `server/.env` and update the following:

```env
NODE_ENV=development
PORT=5001

# MongoDB Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/your-database-name

# For MongoDB Atlas (Cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:5000

# Bcrypt Salt Rounds
BCRYPT_SALT_ROUNDS=10
```

#### Frontend (.env file)

Create a `.env` file in the `client/` directory:

```bash
cd client
cp env.example .env
```

Edit `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5001
REACT_APP_ENV=development
```

### 3. Set Up MongoDB

#### Option A: Local MongoDB

1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # Windows (Run as Administrator)
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```
3. Update `MONGODB_URI` in `server/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/myapp
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string
6. Update `MONGODB_URI` in `server/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myapp?retryWrites=true&w=majority
   ```

### 4. Run the Application

#### Option A: Run both servers concurrently (from root)

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5001`
- React frontend on `http://localhost:5000`

#### Option B: Run servers separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

### 5. Verify Setup

1. **Backend Health Check:**
   - Open browser: `http://localhost:5001/api/health`
   - Should see: `{ "status": "OK", "database": "Connected", ... }`

2. **Frontend:**
   - Open browser: `http://localhost:5000`
   - Should see the application interface

3. **Test API:**
   - Create a user through the frontend form
   - Check users list to verify

## Available Scripts

### Root Level
```bash
npm run install-all    # Install all dependencies
npm run dev           # Run both server and client concurrently
npm run server        # Run only backend server
npm run client        # Run only frontend client
npm run build         # Build React app for production
```

### Server
```bash
cd server
npm start             # Start production server
npm run dev          # Start development server with nodemon
```

### Client
```bash
cd client
npm start            # Start React development server
npm run build        # Build for production
npm test            # Run tests
```

## API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users (for testing)
- `GET /api/users/:id` - Get user by ID (for testing)
- `POST /api/users` - Create user (for testing)

### Protected Endpoints (Require Authentication)
- `GET /api/users/me` - Get current logged-in user

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login:** Get JWT token
2. **Protected Routes:** Include token in Authorization header:
   ```
   Authorization: Bearer <your-token>
   ```

## Troubleshooting

### MongoDB Connection Issues

**Error:** `MongoServerError: connection <monitor> to <cluster> closed`

**Solutions:**
- Check if MongoDB is running
- Verify connection string in `.env`
- Check network/firewall settings
- For Atlas: Verify IP whitelist and credentials

### Port Already in Use

**Error:** `Port 5000/5001 is already in use`

**Solutions:**
- Change port in `.env` files
- Kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5001
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -ti:5001 | xargs kill
  ```

### CORS Errors

**Error:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solutions:**
- Verify `CLIENT_URL` in `server/.env` matches React app URL
- Check CORS configuration in `server/server.js`

### Module Not Found Errors

**Solutions:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Do this for both server and client
```

## Development Tips

1. **Environment Variables:** Never commit `.env` files (already in `.gitignore`)

2. **Database Models:** Add new models in `server/models/`

3. **API Routes:** Add new routes in `server/routes/` and controllers in `server/controllers/`

4. **React Components:** Create reusable components in `client/src/components/`

5. **API Services:** Add API calls in `client/src/services/api.js`

6. **Error Handling:** Use the error handler middleware for consistent error responses

7. **Authentication:** Protect routes using the `protect` middleware from `server/middleware/auth.js`

## Production Deployment

### Build Frontend
```bash
cd client
npm run build
```

### Environment Variables
- Set `NODE_ENV=production`
- Use secure JWT secret
- Configure production MongoDB URI
- Update CORS settings

### Process Manager
Use PM2 or similar:
```bash
npm install -g pm2
cd server
pm2 start server.js --name myapp-api
```

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages in console
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running and accessible

---

Happy coding! 🚀


# Node.js + React.js + MongoDB Full-Stack Application

A modern full-stack web application built with Node.js, Express, React, and MongoDB.

## 🚀 Features

- **Backend API** - RESTful API with Express.js and Node.js
- **Frontend UI** - Modern React.js application
- **Database** - MongoDB with Mongoose ODM
- **Authentication** - JWT-based authentication
- **Password Security** - Bcrypt password hashing
- **Error Handling** - Centralized error handling middleware
- **CORS** - Cross-origin resource sharing configured
- **Environment Config** - Environment variable management

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)

## 🛠️ Quick Start

1. **Clone and install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up environment variables:**
   
   **Backend:** Copy `server/env.example` to `server/.env` and configure:
   ```env
   MONGODB_URI=mongodb://localhost:27017/your-database-name
   JWT_SECRET=your-secret-key
   PORT=5001
   CLIENT_URL=http://localhost:5000
   ```
   
   **Frontend:** Copy `client/env.example` to `client/.env` and configure:
   ```env
   REACT_APP_API_URL=http://localhost:5001
   ```

3. **Start MongoDB** (if using local):
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

4. **Run the application:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5001`
   - React frontend on `http://localhost:5000`

## 📁 Project Structure

```
├── server/              # Node.js Backend
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   └── utils/          # Utility functions
│
├── client/             # React Frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── context/    # React Context
│   │   ├── services/   # API services
│   │   └── utils/      # Helper functions
│   └── public/         # Static files
│
├── SETUP_GUIDE.md      # Detailed setup instructions
└── PROJECT_STRUCTURE.md # Project structure documentation
```

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup and configuration guide
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Detailed project structure documentation
- **[DATABASE_CONNECTION_GUIDE.md](./DATABASE_CONNECTION_GUIDE.md)** - MongoDB connection methods

## 🔧 Available Scripts

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
npm run dev           # Start development server (nodemon)
```

### Client
```bash
cd client
npm start             # Start React development server
npm run build         # Build for production
npm test              # Run tests
```

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user

### Protected Endpoints
- `GET /api/users/me` - Get current logged-in user (requires JWT token)

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. Register or login to get a JWT token
2. Include token in Authorization header for protected routes:
   ```
   Authorization: Bearer <token>
   ```

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **React Router** - Routing (ready for use)
- **Context API** - State management

## 📝 Environment Variables

### Server (`server/.env`)
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/your-database-name
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5000
BCRYPT_SALT_ROUNDS=10
```

### Client (`client/.env`)
```env
REACT_APP_API_URL=http://localhost:5001
REACT_APP_ENV=development
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running
- Check connection string in `.env`
- For Atlas: Verify IP whitelist and credentials

### Port Already in Use
- Change port in `.env` files
- Kill process using the port

### CORS Errors
- Verify `CLIENT_URL` matches React app URL
- Check CORS configuration in `server/server.js`

See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for detailed troubleshooting.

## 📄 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For issues or questions:
1. Check the troubleshooting section in SETUP_GUIDE.md
2. Review error messages in console
3. Verify environment variables are set correctly

---

**Happy coding!** 🚀

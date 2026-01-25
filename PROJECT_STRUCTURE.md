# Project Structure Documentation

Complete overview of the project file structure and their purposes.

## Root Directory

```
node-react-mongodb-app/
├── .gitignore              # Git ignore rules
├── package.json            # Root package.json with scripts to run both projects
├── SETUP_GUIDE.md          # Detailed setup instructions
└── PROJECT_STRUCTURE.md    # This file
```

## Backend (Server) Structure

```
server/
├── config/
│   └── database.js         # MongoDB connection configuration
│
├── controllers/
│   └── userController.js   # User-related business logic
│                           # - register, login, getUsers, getUser, etc.
│
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   │                       # - protect: Verify JWT token
│   │                       # - authorize: Role-based access control
│   ├── asyncHandler.js     # Wrapper for async route handlers
│   └── errorHandler.js     # Global error handling middleware
│
├── models/
│   └── User.js             # User Mongoose schema/model
│                           # - Fields: name, email, password, role
│                           # - Password hashing with bcrypt
│                           # - Methods: matchPassword
│
├── routes/
│   └── userRoutes.js       # User API routes
│                           # - Maps routes to controllers
│                           # - Applies middleware (auth, etc.)
│
├── utils/
│   ├── logger.js           # Custom logging utility
│   └── validators.js       # Input validation helpers
│
├── .env.example            # Environment variables template
├── .env                    # Actual environment variables (not in git)
├── package.json            # Server dependencies and scripts
└── server.js               # Express app entry point
```

### Backend File Descriptions

#### `server.js`
- Express application setup
- Middleware configuration (CORS, body parser)
- Route mounting
- Error handling
- Server startup

#### `config/database.js`
- MongoDB connection using Mongoose
- Connection event handlers
- Graceful shutdown handling

#### `models/User.js`
- User schema definition
- Password hashing middleware
- Password comparison method
- Timestamps

#### `controllers/userController.js`
- Business logic for user operations
- Uses asyncHandler for error handling
- JWT token generation
- Input validation

#### `routes/userRoutes.js`
- Defines API endpoints
- Maps routes to controller functions
- Applies middleware (authentication, etc.)

#### `middleware/auth.js`
- JWT token verification
- User authentication
- Role-based authorization

#### `middleware/errorHandler.js`
- Centralized error handling
- Format error responses
- Handle Mongoose errors

#### `middleware/asyncHandler.js`
- Wrapper for async route handlers
- Automatically catches errors
- Passes to error handler

## Frontend (Client) Structure

```
client/
├── public/
│   └── index.html          # HTML template
│
├── src/
│   ├── components/
│   │   ├── Header.js       # App header component
│   │   ├── Header.css
│   │   ├── UserCard.js     # User display card
│   │   ├── UserCard.css
│   │   ├── Loading.js      # Loading spinner component
│   │   └── Loading.css
│   │
│   ├── context/
│   │   └── AuthContext.js  # Authentication context provider
│   │                       # - Manages user state
│   │                       # - Login/logout/register functions
│   │
│   ├── services/
│   │   └── api.js          # Axios instance and API service functions
│   │                       # - Request/response interceptors
│   │                       # - Token management
│   │                       # - API methods (users, auth)
│   │
│   ├── utils/
│   │   └── helpers.js      # Utility functions
│   │                       # - Date formatting
│   │                       # - Email validation
│   │                       # - Token management
│   │                       # - Error handling
│   │
│   ├── App.js              # Main App component
│   ├── App.css             # App styles
│   ├── index.js            # React app entry point
│   └── index.css           # Global styles
│
├── .env.example            # Environment variables template
├── .env                    # Actual environment variables
├── package.json             # Client dependencies and scripts
└── README.md               # Client-specific documentation
```

### Frontend File Descriptions

#### `src/index.js`
- React app entry point
- Renders App component
- StrictMode enabled

#### `src/App.js`
- Main application component
- Uses AuthProvider context
- Manages application state
- Renders main UI sections

#### `src/context/AuthContext.js`
- Authentication state management
- User login/logout/register
- Token management
- Auth state persistence

#### `src/services/api.js`
- Axios configuration
- Request interceptor (adds auth token)
- Response interceptor (handles errors)
- API service methods

#### `src/components/Header.js`
- Navigation header
- User information display
- Logout functionality

#### `src/components/UserCard.js`
- Displays user information
- Reusable card component

#### `src/components/Loading.js`
- Loading spinner component
- Reusable loading indicator

#### `src/utils/helpers.js`
- Date formatting
- Email validation
- Token management helpers
- Error message extraction
- Debounce function

## Data Flow

### Backend Flow

1. **Request** → `server.js`
2. **Middleware** → CORS, body parser, logging
3. **Routes** → `routes/userRoutes.js`
4. **Middleware** → Authentication (if protected)
5. **Controller** → `controllers/userController.js`
6. **Model** → `models/User.js` → MongoDB
7. **Response** → Client

### Frontend Flow

1. **User Action** → Component
2. **Service Call** → `services/api.js`
3. **API Request** → Backend
4. **Response Handling** → Update state
5. **Re-render** → UI updates

## Key Technologies

### Backend
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **CORS** - Cross-origin requests

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **React Router** - Routing (ready for use)
- **Context API** - State management

## Environment Variables

### Server (.env)
```env
NODE_ENV              # Environment (development/production)
PORT                  # Server port
MONGODB_URI          # MongoDB connection string
JWT_SECRET           # JWT signing secret
JWT_EXPIRE           # JWT expiration time
CLIENT_URL           # Frontend URL for CORS
BCRYPT_SALT_ROUNDS   # Password hashing rounds
```

### Client (.env)
```env
REACT_APP_API_URL    # Backend API URL
REACT_APP_ENV        # Environment
```

## Adding New Features

### Adding a New Model

1. Create schema in `server/models/`
2. Create controller in `server/controllers/`
3. Create routes in `server/routes/`
4. Mount routes in `server/server.js`

### Adding a New React Component

1. Create component in `client/src/components/`
2. Create styles (if needed)
3. Import and use in `App.js` or other components

### Adding a New API Endpoint

1. Add method to controller (`server/controllers/`)
2. Add route in routes file (`server/routes/`)
3. Add service method (`client/src/services/api.js`)
4. Use in React component

## Best Practices

1. **Environment Variables:** Never commit `.env` files
2. **Error Handling:** Use middleware for consistent error responses
3. **Validation:** Validate input on both frontend and backend
4. **Authentication:** Protect sensitive routes
5. **Code Organization:** Keep controllers thin, business logic in services
6. **Component Reusability:** Create reusable React components
7. **API Consistency:** Use consistent response formats
8. **Security:** Hash passwords, use HTTPS in production

## Future Enhancements

Potential additions:
- [ ] Email verification
- [ ] Password reset functionality
- [ ] File upload capabilities
- [ ] Real-time features (WebSocket)
- [ ] Testing suite (Jest, React Testing Library)
- [ ] API documentation (Swagger)
- [ ] Rate limiting
- [ ] Input sanitization middleware
- [ ] Logging service (Winston)
- [ ] Docker configuration
- [ ] CI/CD pipeline


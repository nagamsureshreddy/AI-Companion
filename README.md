# AI Companion

A full-stack AI application with React frontend, Node.js/Express backend, and MongoDB database.

## 📁 Project Structure

```
AI Companion/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Auth/      # Login & Register
│   │   │   ├── Chat/      # Chat interface
│   │   │   └── Dashboard/ # Dashboard
│   │   ├── context/       # React Context (Auth)
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── server/                # Node.js Backend
    ├── config/            # Configuration files
    ├── controllers/       # Route controllers
    ├── middleware/        # Custom middleware
    ├── models/            # MongoDB models
    ├── routes/            # API routes
    ├── server.js          # Entry point
    └── package.json
```

## 🚀 Features

- **User Authentication**: Register, login, and JWT-based authentication
- **AI Chat Interface**: Beautiful, responsive chat UI
- **Conversation Management**: Create, view, and manage conversations
- **User Dashboard**: View all conversations and user profile
- **MongoDB Integration**: Ready for database connection
- **Modern UI/UX**: Gradient design with smooth animations

## 🛠️ Technologies

### Frontend
- React 18
- React Router DOM
- Axios
- Styled Components
- React Icons

### Backend
- Node.js
- Express.js
- DB & Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Helmet for security
- CORS

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB account (MongoDB Atlas or local MongoDB)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```bash
cp .env.example .env
```

4. Add your MongoDB connection string and other environment variables to `.env`:
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

5. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the React app:
```bash
npm start
```

The app will run on `http://localhost:3000`

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### AI Conversations
- `GET /api/ai/conversations` - Get all user conversations
- `POST /api/ai/conversations` - Create new conversation
- `GET /api/ai/conversations/:id` - Get single conversation
- `POST /api/ai/conversations/:id/messages` - Send message
- `DELETE /api/ai/conversations/:id` - Delete conversation

## 🔐 Environment Variables

Create a `.env` file in the server directory with these variables:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:3000
```

## 🗄️ MongoDB Setup

### Option 1: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Click "Connect" and get your connection string
5. Replace `<password>` with your database user password
6. Add the connection string to your `.env` file

Example:
```
MONGODB_URI=mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/ai-companion?retryWrites=true&w=majority
```

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string:
```
MONGODB_URI=mongodb://localhost:27017/ai-companion
```

## 📱 Usage

1. **Register**: Create a new account at `/register`
2. **Login**: Login with your credentials at `/login`
3. **Dashboard**: View all your conversations
4. **New Chat**: Click "New Conversation" to start chatting
5. **Chat**: Send messages and receive AI responses

## 🎨 UI Features

- Beautiful gradient design
- Smooth animations
- Responsive layout for mobile and desktop
- Modern card-based UI
- Real-time typing indicators
- Message timestamps

## 🔮 Future Enhancements

- [ ] Integrate with OpenAI GPT API
- [ ] Add file upload support
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Export conversations
- [ ] Share conversations
- [ ] User settings page
- [ ] Admin panel

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Developer Notes

- The AI integration is currently a placeholder that echoes messages back
- To integrate a real AI service (like OpenAI), modify `server/controllers/aiController.js`
- JWT tokens expire after 7 days (configurable in `.env`)
- The app includes basic security with Helmet.js and CORS
- All passwords are hashed using bcrypt before storage

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Ensure your IP is whitelisted in MongoDB Atlas
- Check your connection string format
- Verify database user credentials

### CORS Issues
- Ensure `CLIENT_URL` in `.env` matches your frontend URL
- Check that the proxy in `client/package.json` points to your backend

### Port Already in Use
- Change the `PORT` in `.env` to a different port
- Kill the process using the port: `lsof -ti:5000 | xargs kill`

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Happy Coding! 🚀**


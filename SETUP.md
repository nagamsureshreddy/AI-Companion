# Quick Setup Guide

Follow these steps to get your AI Companion app running:

## 1️⃣ Install Backend Dependencies

```bash
cd server
npm install
```

## 2️⃣ Configure Environment Variables

The `.env` file has been created in the `server` directory. You need to add your MongoDB connection string:

### Get MongoDB Connection String

#### Option A: MongoDB Atlas (Free Cloud Database)
1. Visit https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (M0 Free Tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

#### Option B: Local MongoDB
If you have MongoDB installed locally:
```
MONGODB_URI=mongodb://localhost:27017/ai-companion
```

### Update .env file
Open `server/.env` and add your MongoDB connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ai-companion?retryWrites=true&w=majority
```

## 3️⃣ Install Frontend Dependencies

```bash
cd ../client
npm install
```

## 4️⃣ Start the Application

### Terminal 1 - Start Backend Server
```bash
cd server
npm run dev
```
Server will run on http://localhost:5000

### Terminal 2 - Start Frontend
```bash
cd client
npm start
```
App will open at http://localhost:3000

## 5️⃣ Test the Application

1. Open http://localhost:3000
2. Click "Register here" to create an account
3. Fill in your details and register
4. You'll be redirected to the dashboard
5. Click "New Conversation" to start chatting

## ✅ Verification Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend app running on port 3000
- [ ] MongoDB connection successful (check server console)
- [ ] Can register a new user
- [ ] Can login
- [ ] Can create a new conversation
- [ ] Can send messages

## 🐛 Common Issues

### "MongoDB connection failed"
- Check your MongoDB URI is correct
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify network connection

### "Port already in use"
- Stop other applications using ports 3000 or 5000
- Or change the PORT in server/.env

### "Module not found"
- Run `npm install` in both client and server directories
- Delete node_modules and package-lock.json, then reinstall

## 🎉 Success!

Once everything is running, you should see:
- ✅ MongoDB Connected in the server console
- ✅ React app loaded in your browser
- ✅ Ability to register/login and chat

## Next Steps

1. **Add MongoDB Connection**: Update the MONGODB_URI in server/.env
2. **Integrate AI Service**: Later, you can add OpenAI or other AI APIs
3. **Customize**: Modify the UI and features as needed

---

Need help? Check README.md for detailed documentation!


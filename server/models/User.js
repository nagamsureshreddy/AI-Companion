const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Identity
  firstName: {
    type: String,
    required: [true, 'Please provide a first name'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a last name'],
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  userId: {
    type: String,
    required: [true, 'Please provide a user id'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't return password by default
  },
  // Compatibility with existing documents that store passwordHash
  passwordHash: {
    type: String,
    select: false,
  },
  role: {
    type: String,
    enum: ['author', 'reader', 'admin'],
    default: 'reader',
  },
  location: {
    type: String,
    trim: true,
  },
  ageGroup: {
    type: String,
    enum: ['13-17', '18-24', '25-34', '35-44', '45-54', '55+'],
  },
  interests: [
    {
      type: String,
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Normalize role to lowercase for consistency
  if (this.role) {
    this.role = this.role.toLowerCase();
  }

  // If username missing, mirror userId
  if (!this.username && this.userId) {
    this.username = this.userId;
  }

  // Hash password if provided/changed
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(this.password, salt);
    this.password = hashed;
    this.passwordHash = hashed; // keep both for compatibility with existing documents
  } else if (this.isModified('passwordHash') && this.passwordHash && !this.password) {
    // If passwordHash was set directly (less common), mirror to password
    this.password = this.passwordHash;
  }

  next();
});

// Update timestamp on save
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  const storedHash = this.password || this.passwordHash;
  if (!storedHash) return false;
  return await bcrypt.compare(enteredPassword, storedHash);
};

module.exports = mongoose.model('User', userSchema);




const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const jwt = require('jsonwebtoken');

/**
 * @desc    Register new user
 * @route   POST /api/users/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    username,
    userId,
    location,
    ageGroup,
    interests,
    role,
  } = req.body;

  // Basic validation
  if (!firstName || !lastName || !email || !password || !(userId || username)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide firstName, lastName, email, userId, and password',
    });
  }

  const normalizedUserId = (userId || username).toLowerCase();

  // Normalize interests
  const interestArray = Array.isArray(interests)
    ? interests
    : typeof interests === 'string'
      ? interests.split(',').map((i) => i.trim()).filter(Boolean)
      : [];

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    email,
    username: normalizedUserId,
    userId: normalizedUserId,
    password,
    location,
    ageGroup,
    interests: interestArray,
    role: (role || 'reader').toLowerCase(),
  });

  // Generate token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    data: {
      id: user._id,
      name: user.name,
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role,
      location: user.location,
      ageGroup: user.ageGroup,
      interests: user.interests,
      createdAt: user.createdAt,
    },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/users/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { identifier, email, username, userId, password } = req.body;
  const loginId = (identifier || email || userId || username || '').toLowerCase();

  // Validate identifier & password
  if (!loginId || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an email/username and password',
    });
  }

  // Check for user by email or username
  const user = await User.findOne({
    $or: [{ email: loginId }, { username: loginId }, { userId: loginId }],
  }).select('+password +passwordHash');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Generate token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

  res.json({
    success: true,
    message: 'Login successful',
    token,
    data: {
      id: user._id,
      name: user.name,
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role,
      location: user.location,
      ageGroup: user.ageGroup,
      interests: user.interests,
    },
  });
});

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Public (for testing, should be protected in production)
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select('-password');

  res.json({
    success: true,
    count: users.length,
    data: users,
  });
});

/**
 * @desc    Get single user
 * @route   GET /api/users/:id
 * @access  Public (for testing, should be protected in production)
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/users/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');

  res.json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Create user
 * @route   POST /api/users
 * @access  Public (for testing, should be protected in production)
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    username,
    userId,
    location,
    ageGroup,
    interests,
    role,
  } = req.body;

  const normalizedUserId = (userId || username || '').toLowerCase();

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username: normalizedUserId }, { userId: normalizedUserId }],
  });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email or username',
    });
  }

  // Normalize interests
  const interestArray = Array.isArray(interests)
    ? interests
    : typeof interests === 'string'
      ? interests.split(',').map((i) => i.trim()).filter(Boolean)
      : [];

  const user = await User.create({
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    email,
    username: normalizedUserId,
    userId: normalizedUserId,
    password,
    location,
    ageGroup,
    interests: interestArray,
    role: (role || 'reader').toLowerCase(),
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      id: user._id,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role,
      location: user.location,
      ageGroup: user.ageGroup,
      interests: user.interests,
      createdAt: user.createdAt,
    },
  });
});


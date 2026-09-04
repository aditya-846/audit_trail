const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

// Role mapping helper to handle UI values or standard enum strings
const normalizeRole = (roleInput) => {
  if (!roleInput) return 'AUDITOR';
  const role = String(roleInput).toUpperCase().trim();
  
  if (role === 'READ-ONLY' || role === 'READ_ONLY') return 'AUDITOR';
  if (role === 'CAN-EDIT' || role === 'CAN_EDIT') return 'DISPATCHER';
  if (role === 'CAN-LOG-SENSOR-DATA' || role === 'CAN_LOG_SENSOR_DATA') return 'TELEMETRY_BOT';
  
  if (['AUDITOR', 'DISPATCHER', 'TELEMETRY_BOT'].includes(role)) {
    return role;
  }
  return 'AUDITOR';
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Email and password are required'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Password must be at least 6 characters long'
    });
  }

  try {
    const normalizedEmail = String(email).toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        error: 'EMAIL_EXISTS',
        message: 'An account with this email already exists'
      });
    }

    const assignedRole = normalizeRole(role);
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      email: normalizedEmail,
      passwordHash,
      role: assignedRole
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error during signup:', error.message);
    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create user account'
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Email and password are required'
    });
  }

  try {
    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Authentication failed'
    });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        error: 'USER_NOT_FOUND',
        message: 'User profile not found'
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve user profile'
    });
  }
});

module.exports = router;

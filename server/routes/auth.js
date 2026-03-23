const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authMiddleware = require('../middleware/auth');

// ✅ Validate JWT secret once (important)
const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('❌ JWT_SECRET environment variable is not set');
}

// ─── POST /api/auth/login ─────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // ✅ Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    const user = await User.findOne({ username: username.trim() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
});

// ─── POST /api/auth/setup (run once) ──────────────────────────────────
router.post('/setup', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Setup disabled in production.',
      });
    }

    const existing = await User.findOne({ username: 'admin' });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists',
      });
    }

    const hashed = await bcrypt.hash('mkcc@admin2024', 10);

    const admin = await User.create({
      username: 'admin',
      password: hashed,
      role: 'superadmin',
    });

    res.json({
      success: true,
      message: 'Admin created',
      username: 'admin',
      password: 'mkcc@admin2024',
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
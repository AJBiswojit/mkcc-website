const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

app.use(helmet());

// ─── CORS Config ─────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://mkcc-website.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply same corsOptions to both preflight and actual requests
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ← pass corsOptions here, not bare cors()

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Rate Limiter ─────────────────────────────────────────────────────────────
const publicLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

// ─── Routes ───────────────────────────────────────────────────────────────────
const eventsRouter        = require('./routes/events');
const membersRouter       = require('./routes/members');
const galleryRouter       = require('./routes/gallery');
const announcementsRouter = require('./routes/announcements');
const joinRouter          = require('./routes/join');
const authRouter          = require('./routes/auth');
const uploadRouter        = require('./routes/upload');
const donationsRouter     = require('./routes/donations');
const visitorRouter       = require('./routes/visitor');

app.use('/api/join',      publicLimit, joinRouter);
app.use('/api/donations', publicLimit, donationsRouter);
app.use('/api/visitor',   publicLimit, visitorRouter);

app.use('/api/events',        eventsRouter);
app.use('/api/members',       membersRouter);
app.use('/api/gallery',       galleryRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/auth',          authRouter);
app.use('/api/upload',        uploadRouter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MKCC API is running 🏏', timestamp: new Date() });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── Database & Server ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mkcc';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🏏 MKCC Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
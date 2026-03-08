const mongoose = require('mongoose');

// ─── Gallery ─────────────────────────────────────────────────────────────────
const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true },
  category: {
    type: String,
    enum: ['Ganesh Puja', 'Cricket', 'Club Activities', 'Tournament', 'Other'],
    default: 'Other',
  },
  caption: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false },
  eventRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
}, { timestamps: true });

// ─── Announcement ─────────────────────────────────────────────────────────────
const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'urgent'],
    default: 'info',
  },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, default: null },
}, { timestamps: true });

// ─── JoinRequest ─────────────────────────────────────────────────────────────
const joinRequestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  village: { type: String, default: 'Patuli, Olaver' },
  role: {
    type: String,
    enum: ['Player', 'Member', 'Volunteer'],
    default: 'Member',
  },
  message: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

// ─── Admin User ───────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
}, { timestamps: true });

const Gallery      = mongoose.model('Gallery', gallerySchema);
const Announcement = mongoose.model('Announcement', announcementSchema);
const JoinRequest  = mongoose.model('JoinRequest', joinRequestSchema);
const User         = mongoose.model('User', userSchema);

module.exports = { Gallery, Announcement, JoinRequest, User };

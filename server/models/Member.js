const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['President', 'Vice President', 'Secretary', 'Treasurer', 'Captain', 'Vice Captain', 'Player', 'Committee Member'],
  },
  photo: {
    type: String,
    default: '',
  },
  jerseyNumber: {
    type: Number,
    default: null,
  },
  battingStyle: {
    type: String,
    enum: ['Right-handed', 'Left-handed', ''],
    default: '',
  },
  bowlingStyle: {
    type: String,
    default: '',
  },
  village: {
    type: String,
    default: 'Patuli, Olaver',
  },
  bio: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 99,
  },
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);

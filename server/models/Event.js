const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  endDate: {
    type: Date,
    default: null,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    enum: ['Cricket', 'Cultural', 'Puja', 'Tournament', 'Meeting', 'Other'],
    default: 'Other',
  },
  images: [{ type: String }],
  venue: {
    type: String,
    default: 'Patuli Ground, Olaver',
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming',
  },
  highlights: [{ type: String }],
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Auto-set status based on date
eventSchema.pre('save', function(next) {
  const now = new Date();
  if (this.date > now) this.status = 'upcoming';
  else if (this.endDate && this.endDate > now) this.status = 'ongoing';
  else this.status = 'completed';
  next();
});

module.exports = mongoose.model('Event', eventSchema);

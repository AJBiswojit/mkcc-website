const express = require('express');
const router  = express.Router();
const { Visitor } = require('../models');

// POST /api/visitor/hit — call once when user visits site
router.post('/hit', async (req, res) => {
  try {
    const doc = await Visitor.findOneAndUpdate(
      { key: 'total' },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
    res.json({ success: true, count: doc.count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/visitor/count — get current count (public)
router.get('/count', async (req, res) => {
  try {
    const doc = await Visitor.findOne({ key: 'total' });
    res.json({ success: true, count: doc?.count || 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
